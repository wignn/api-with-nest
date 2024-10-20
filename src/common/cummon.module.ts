import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validate.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
    format: winston.format.json(),
    transports:[
        new winston.transports.Console()
    ]
    }),
    ConfigModule.forRoot({
        isGlobal: true,
    }),
  ],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
