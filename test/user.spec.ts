import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
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

  afterEach(async () => {
    await testService.deleteUser();
  });

  describe('POST /api/users/register', () => {
    afterEach(async () => {
      await testService.deleteUser();
    });

    beforeEach(async () => {
      await testService.deleteUser();
    })
    
    it('should return 400 if required fields are empty', async () => {
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

    it('should return 200 and create a new user with valid data', async () => {
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
    let accessToken: string;
    let refreshToken: string;
    beforeEach(async () => {
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should return 200 and login user with valid credentials', async () => {
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

    it('should return 400 if credentials are invalid', async () => {
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
    let accessToken: string;

    beforeEach(async () => {
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test123',
        });
      accessToken = await loginResponse.body.data.backendTokens.accessToken;
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should return 200 and retrieve user data by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/test`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/users/refresh', () => {
    let refreshToken: string;
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

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should return 200 and refresh the token successfully', async () => {
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

      accessToken =  loginResponse.body.data.backendTokens.accessToken;
      userId =  loginResponse.body.data.id;

      if (!userId) {
        const userResponse = await request(app.getHttpServer())
          .get(`/api/users/profile`)
          .set('Authorization', `Bearer ${accessToken}`);

        userId = userResponse.body.data.id;
      }
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should return 200 and update user data successfully', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users')
        .set('authorization', `Bearer ${accessToken}`)
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
