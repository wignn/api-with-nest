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
    let token: string;
    beforeEach(async () => {
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
      token = loginResponse.body.data.token;
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
    });

    it('should respond with status 200 and return a message', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books')
        .set('Authorization', `${token}`)
        .send({
          title: 'test',
          description: 'test',
          author: 'test',
          cover: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should respond with status 401 if authorization is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          title: 'testq',
          description: 'test',
          author: 'test',
          cover: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/books/:query', () => {
    beforeEach(async () => {
      await testService.createBook();
    });

    afterEach(async () => {
      await testService.deletebook();
    });

    it('should retrieve a book with status 200', async () => {
      const query = 'test';
      const response = await request(app.getHttpServer()).get(
        `/api/books/${query}`,
      );

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('test');
    });
  });

  describe('GET /api/books', () => {
    it('should retrieve all books with status 200', async () => {
      const response = await request(app.getHttpServer()).get('/api/books');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId: string;
    let token: string;
    beforeEach(async () => {
      const book = await testService.createBook();
      bookId = book;
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
      token = loginResponse.body.data.token;
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
    });

    it('should update a book with status 200', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/books/${bookId}`)
        .set('Authorization', `${token}`)
        .send({
          description: 'updated description',
          author: 'updated author',
          cover: 'updated cover',
          asset: 'updated asset',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.author).toBe('updated author');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId: string;
    let token: string;
    beforeEach(async () => {
      const book = await testService.createBook();
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
      token = loginResponse.body.data.token;
      bookId = book;
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
    });

    it('should delete a book with status 200', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `${token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
