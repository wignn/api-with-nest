import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mailer.service';
import { MailerRequest } from '../model/mailer.model';

@Controller('/api/mailer')
export class MailerController {
    constructor(private MailerService: MailService) {}

    @Post()
    async sendMail(@Body() request: MailerRequest ) {
        return await this.MailerService.verifyEmail(request);
    }
}