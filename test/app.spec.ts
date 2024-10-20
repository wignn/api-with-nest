import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let Logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    Logger = app.get(WINSTON_MODULE_PROVIDER);
  });

describe("POST /api/users", () => {
  it("should be rejected with 400 ", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/users")
      .send({
        username: "",
        password: "",
        name: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  })

  it("should be successful with 200", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/users")
      .send({
        username: "ttyy",
        password: "rrttyyuuuu",
        name: "test",
        email: "test123@gmail.com"
      });
      Logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  })
})
})
