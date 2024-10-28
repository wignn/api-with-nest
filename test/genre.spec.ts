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

    it('should fail with status 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          description: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined;
    });
  });

  describe('GET /api/genre', () => {
    beforeEach(async () => {
      await testService.createGenre();
    });

    afterEach(async () => {
      await testService.DeleteGenre();
    });

    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer()).get('/api/genre');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });

    it('should be succesful with 200', async () => {
      const query = 'test';
      const response = await request(app.getHttpServer()).get(
        `/api/genre/${query}`,
      );
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });
  });

  describe('PUT /api/genre', () => {
    let id: string;
    beforeEach(async () => {
      const CreateBookResponse = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          title: 'test',
          description: 'test',
        });
      id = CreateBookResponse.body.id;
    });

    afterEach(async () => {
      await testService.DeleteGenre();
    });

    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/genre/${id}`)
        .send({
          description: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });

    it('should fail with status 400', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/genre/${id}`)
        .send({
          title: 't',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined;
    });
  });

  describe('DELETE /api/genre', () => {
    let id: string;
    beforeEach(async () => {
      const CreateBookResponse = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          title: 'test',
          description: 'test',
        });
      id = CreateBookResponse.body.id;
    });

    afterEach(async () => {
      await testService.DeleteGenre();
    });

    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/api/genre/${id}`,
      );
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });

    it('should not found with status 404', async () => {
      const response = await request(app.getHttpServer()).delete(`/api/genre`);
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined;
    });
  });

  describe('PATCH /api/genre', () => {
    let id: string;
    let bookId: string;
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/api/users/register').send({
        username: 'test',
        password: 'test123',
        name: 'test',
        email: 'test@gmail.com',
      });

      const Login = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });

      const CreateBook = await request(app.getHttpServer())
        .post('/api/books')
        .set('Authorization', `${Login.body.data.token}`)
        .send({
          title: 'test',
          description: 'test',
          author: 'test',
          cover: 'test',
        });
      const CreateBookResponse = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          title: 'test',
          description: 'test',
        });

      bookId = CreateBook.body.data.id;
      id = CreateBookResponse.body.id;
      console.log(CreateBook.body);
      console.log(CreateBookResponse.body);
    });

    afterEach(async () => {
      await testService.DeleteGenre();
      await testService.deletebook();
    });

    it('should be conect genre to book with status 200', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/genre`)
        .send({
          genreId: id,
          bookId: bookId,
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });

    it('should disconect genre with book', async () => {
      const response = await request(app.getHttpServer()).put(
        `/api/genre/${id}`,
      );

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined;
    });
  });
});
