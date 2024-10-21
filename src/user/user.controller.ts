import { WebResponse } from 'src/model/web.model';
import { UserService } from './user.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.login(request);
    return {
      data: result,
    };
  }
}
