import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  working(): Promise<string> {
    return this.appService.working();
  }

  @Get('doc')
  doc(): Promise<string> {
    return this.appService.doc();
  }
}
