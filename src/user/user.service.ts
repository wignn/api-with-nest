import { ValidationService } from './../common/validate.service';
import { UserResponse } from './../model/user.model';
import { PrismaService } from 'src/common/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest } from 'src/model/user.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
       @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}
    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Registering new user ${JSON.stringify(request)}`);
        this.validationService.validate()
      return null
    }
}