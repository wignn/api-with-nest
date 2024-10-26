import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('bookController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  describe('POST /api/genre', () => {
    afterEach(async () => {
      await testService.DeleteGenre();
    });
    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          title: 'test',
          description: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });
  });
});
