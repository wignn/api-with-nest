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
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  afterEach(async () => {
    await testService.deleteUser();
  });

  describe('POST /api/users/register', () => {
    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected with 400', async () => {
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

    it('should be successful with 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });

      logger.info(response.body);
      accessToken = response.body.data.backendTokens.accessToken;
      refreshToken = response.body.data.backendTokens.refreshToken;
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected with 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/users/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
      accessToken = loginResponse.body.data.backendTokens.accessToken;
    });

    it('should be successful with 200', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/test`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/users/refresh', () => {
    beforeEach(async () => {
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
      refreshToken = loginResponse.body.data.backendTokens.refreshToken;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/refresh')
        .set('Authorization', `Refresh ${refreshToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PATCH /api/users', () => {
    let accessToken: string;
    let userId: string;
  
    beforeEach(async () => {
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
  
      accessToken = loginResponse.body.data.backendTokens.accessToken;
      userId = loginResponse.body.data.id;
  
      if (!userId) {
        const userResponse = await request(app.getHttpServer())
          .get(`/api/users/profile`)
          .set('Authorization', `Bearer ${accessToken}`);
  
        userId = userResponse.body.data.id;
      }
    });
  
    it('should update user successfully with 200', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          id: userId,
          username: 'testUpdated',
          name: 'Updated',
        });
  
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
  
});
