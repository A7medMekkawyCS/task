import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';

describe('Auth + Health (e2e)', () => {
  let app: INestApplication<App>;
  const secretKey = process.env.SECRET_KEY || 'my-app-secret-key';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  it('/health (GET) should be public with secret_key', () => {
    return request(app.getHttpServer())
      .get('/health')
      .set('secret_key', secretKey)
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          key: string;
          status: string;
          data: { status: string };
        };
        expect(body.key).toBe('success');
        expect(body.status).toBe('200');
        expect(body.data.status).toBe('ok');
      });
  });

  it('/health (GET) without secret_key should fail', () => {
    return request(app.getHttpServer()).get('/health').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
