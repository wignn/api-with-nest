import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CoService } from './co/co.service';
import { UserService } from './user.service';

@Module({
  providers: [UserService, CoService],
  controllers: [UserController]
})
export class UserModule {}
