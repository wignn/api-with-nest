import { WebResponse } from 'src/model/web.model';
import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserRequest, UserResponse } from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private UserService: UserService) {}
  @Post()
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.register(request);
    return {
      data: result,
    };
  }
}
