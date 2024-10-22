import { PrismaService } from './../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from './../common/validate.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { MailerRequest } from 'src/model/mailer.model';

@Injectable()
export class MailService {
  constructor(
    private ValidationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private PrismaService: PrismaService,
  ) {}

  async verifyEmail(request: MailerRequest): Promise<string> {
    this.logger.info(`Verifying email ${JSON.stringify(request)}`);
    const validate = await this.PrismaService.user.findUnique({
        where: { email: request.email },
    })

    if (!validate) {
        throw new HttpException('Email not found', 400);
    }

    await this.PrismaService.user.update({
      where: { email: request.email },
      data: {
        valToken: uuidv4(),
      },
    });
    return 'Email verified';
  }
}
