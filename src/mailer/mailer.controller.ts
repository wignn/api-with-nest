import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mailer.service';
import { MailerRequest } from 'src/model/mailer.model';

@Controller('mailer')
export class MailerController {
    constructor(private MailerService: MailService) {}

    @Post('send')
    async sendMail(@Body() request: MailerRequest ) {
        return await this.MailerService.verifyEmail(request);
    }
}