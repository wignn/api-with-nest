import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users/register', () => {
    afterEach(async () => {
      await testService.deleteUser();
    });


    it('should be rejected with 400 ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be successful with 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: 'test',
          password: 'test123',
          name: 'test',
          email: 'test@gmail.com',
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should be successful with 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected with 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
