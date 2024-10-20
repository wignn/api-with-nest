import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/cummon.module';
import { userModule } from './user/user.module';

@Module({
  imports: [CommonModule, userModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
