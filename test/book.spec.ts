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
      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer())
        
        .post('/api/books')
        .send({
          title: 'test',
          description: 'test',
          author: 'test',
          cover: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/books/:query', () => {
    beforeEach(async () => {
      await testService.createBook();
    });

    afterEach(async () => {
      await testService.deletebook();
    });

    it('should be successful with status 200', async () => {
      const query = 'test';
      const response = await request(app.getHttpServer()).get(
        `/api/books/${query}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('test');
    });
  });

  it('should be successful with status 200', async () => {
    const response = await request(app.getHttpServer()).get('/api/books');
    logger.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});
