import { PrismaService } from './../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from './../common/validate.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { MailerRequest } from '../model/mailer.model';
import { MailerValidation } from './mailer.validation';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    private ValidationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private PrismaService: PrismaService,
  ) {}

  async verifyEmail(request: MailerRequest): Promise<string> {
    this.logger.info(`Verifying email ${JSON.stringify(request)}`);
    const verifyRequest: MailerRequest = this.ValidationService.validate(
      MailerValidation.SEND,
      request,
    );

    const validate = await this.PrismaService.user.findUnique({
      where: { email: verifyRequest.email },
    });

    if (!validate) {
      throw new HttpException('Email not found', 400);
    }

    await this.PrismaService.user.update({
      where: { email: request.email },
      data: {
        valToken: uuidv4(),
      },
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Click the link below to verify your email:</p>
          <a href="http://localhost:3000/api/users/verify/${validate.valToken}" style="color: #1a73e8;">Verify Email</a>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: 'wignn',
      to: validate.email,
      subject: 'Email Verification',
      html: htmlContent,
    });

    return 'Email verified';
  }
}
