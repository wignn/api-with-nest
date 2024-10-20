import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
})
})
