import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('genreController', () => {
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
    await testService.DeleteGenre();
  });

  afterEach(async () => {
    await testService.DeleteGenre();
    await testService.deletebook();
  });

  describe('POST /api/genre', () => {
    afterEach(async () => { 
      await testService.DeleteGenre();
    })
    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          title: 'test',
          description: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should fail with status 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/genre')
        .send({
          description: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /api/genre', () => {
    beforeEach(async () => {
      await testService.createGenre();
    });

    afterEach(async () => {
      await testService.DeleteGenre();
    })

    it('should be successful with status 200', async () => {
      const response = await request(app.getHttpServer()).get('/api/genre');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should be successful with status 200', async () => {
      const query = 'test';
      const response = await request(app.getHttpServer()).get(
        `/api/genre/${query}`,
      );
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('PUT /api/genre', () => {
    let id: string;
    beforeEach(async () => {
      const genre = await testService.createGenre();
      id = genre.id;
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
      expect(response.body).toBeDefined();
    });

    it('should fail with status 400', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/genre/${id}`)
        .send({
          title: 't',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
  });

  describe('DELETE /api/genre', () => {
    let id: string;
    beforeEach(async () => {
      const genre = await testService.createGenre();
      id = genre.id;
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
      expect(response.body).toBeDefined();
    });

    it('should not found with status 404', async () => {
      const response = await request(app.getHttpServer()).delete(`/api/genre`);
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });
  });

  describe('PATCH /api/genre', () => {
    let id: string;
    let bookId: string;
    beforeEach(async () => {
      await testService.createUser();
      await testService.login();
      const CreateBook = await testService.createBook();
      const genre = await testService.createGenre();
      bookId = CreateBook.id;
      id = genre.id;
    });


    it('should connect genre to book with status 200', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/genre`)
        .send({
          genreId: id,
          bookId: bookId,
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should disconnect genre with book', async () => {
      const response = await request(app.getHttpServer())
      .put(`/api/genre`)
      .send({
        genreId: id,
        bookId: bookId,
      })

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    afterEach(async () => {
      await testService.deletebook();
      await testService.deleteUser();
      await testService.DeleteGenre();
    });
  });
});
