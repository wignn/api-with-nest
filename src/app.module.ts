import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/cummon.module';
import { userModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [CommonModule, userModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
