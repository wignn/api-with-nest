import { WebResponse } from 'src/model/web.model';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  ResetRequest,
  UpdateUserRequest,
  UpdateUserRespone,
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
  @HttpCode(200)
  async getUser(@Param('id') id: string): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.findByid(id);
    console.log(id);
    return {
      data: result,
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Request() req): Promise<WebResponse<UserResponse>> {
    const result = await this.UserService.refreshToken(req.user);
    return {
      data: result,
    };
  }

  @Put()
  @HttpCode(200)
  async resetPassword(
    @Body() request: ResetRequest,
  ): Promise<WebResponse<string>> {
    const result = await this.UserService.resetPassword(request);
    return {
      data: result,
    };
  }

  @Patch()
  @HttpCode(200)
  async updateUser(
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UpdateUserRespone>> {
    const result = await this.UserService.update(request);
    return {
      data: result,
    };
  }

  
}
