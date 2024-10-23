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

  describe('POST /api/books', () => {
    afterEach(async () => {
      await testService.deletebook();
    });
    it('should be rejected with 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          title: 'test',
          description: 'test',
          author: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});
