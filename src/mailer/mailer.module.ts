import { Module } from "@nestjs/common";
import { MailerController } from "./mailer.controller";
import { MailService } from "./mailer.service";


@Module({
    providers: [MailService],
    controllers: [MailerController]
})
export class MailerModule {}