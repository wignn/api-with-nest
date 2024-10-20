import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
})
export class AppModule {}
