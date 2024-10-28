import { Injectable, Param } from '@nestjs/common';

@Injectable()
export class AppService {
  async working () : Promise<string> {
    return 'api working';
  }

  async doc() : Promise<string> {
    return 'documentation: https://github.com/wignn/api-with-nest';
  }
}
