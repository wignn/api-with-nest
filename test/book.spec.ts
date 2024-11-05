import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('BookController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let token = 'test';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/books', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books')
        .set('authorization', `${token}`)
        .send({
          title: '',
          description: '',
          author: '',
          cover: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books')
        .set('authorization', `${token}`)
        .send({
          id: 'test',
          title: 'test',
          description: 'test',
          author: 'test',
          cover: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('test');
    });
  });

  describe('GET /api/books', () => {
    

    it('should be able to get all books', async () => {
      const response = await request(app.getHttpServer()).get('/api/books');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be able to get book by query', async () => {
      const response = await request(app.getHttpServer())
      .get(
        '/api/books/test',
      );
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/books', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createBook();
    });
    it('should be able to update book', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/books/test')
        .set('authorization', `test`)
        .send({
          description: 'test123',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('test123');
    });
  });

  describe('DELETE /api/books', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createBook();
    });
    it('should be able to delete book', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/books/test')
        .set('authorization', `test`);
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  })
});
