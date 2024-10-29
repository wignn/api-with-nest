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

  afterEach(async () => {
    await app.close();
  });

  describe('Authentication and User Management', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.login();
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    describe('POST /api/books', () => {
      afterEach(async () => {
        await testService.deletebook();
      });

      it('should respond with status 200 and return a message', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/books')
          .set('authorization', 'test')
          .send({
            title: 'test',
            description: 'test',
            author: 'test',
            cover: 'test',
          });

        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
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
  });

  describe('Book Management', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createBook();
      await testService.login();
      
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
    });

    describe('GET /api/books/:query', () => {
      it('should retrieve a book with status 200', async () => {
        const query = 'test';
        const response = await request(app.getHttpServer()).get(
          `/api/books/${query}`,
        );

        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data.title).toBe('test');
      });
    });

    describe('GET /api/books', () => {
      it('should retrieve all books with status 200', async () => {
        const response = await request(app.getHttpServer()).get('/api/books');
        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
      });
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId: string;
    beforeEach(async () => {
      const { id: Id } = await testService.createBook();
      bookId = Id;
      await testService.createUser();
      await testService.login();
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
    });

    it('should update a book with status 200', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/books/${bookId}`)
        .set('authorization', 'test')
        .send({
          description: 'updated description',
          author: 'updated author',
          cover: 'updated cover',
          asset: 'updated asset',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.data.author).toBe('updated author');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      const book = await testService.createBook();
      bookId = book.id;
      await testService.createUser();
      await testService.login();
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
    });

    it('should delete a book with status 200', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/books/${bookId}`)
        .set('authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });
});
