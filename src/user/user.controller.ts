import { WebResponse } from 'src/model/web.model';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh.guard';

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

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.findByid(id);
    console.log(id);
    return {
      data: result,
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.refreshToken(req.user);
    return {
      data: result,
    };
  }
}
