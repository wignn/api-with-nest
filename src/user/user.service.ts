import { ValidationService } from './../common/validate.service';
import { LoginUserRequest, UserResponse } from './../model/user.model';
import { PrismaService } from '../common/prisma.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest } from 'src/model/user.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}


  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Registering new user ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if(totalUserWithSameUsername != 0){
        throw new HttpException('Username already exists',400);
    }
    registerRequest.password = await bcrypt.hash(registerRequest.password,10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
        id: user.id,
        username: user.username,
        name: user.name,
    };
  }
  
  async login(request: LoginUserRequest): Promise<UserResponse> {
    
    this.logger.info(`Logging in user ${JSON.stringify(request)}`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }

    const isPasswordMatch = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid username or password', 400);
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }
}
