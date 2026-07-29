import request from 'supertest';
import { Test } from '@nestjs/testing';
import { HealthModule } from '../src/health/health.module';
import { INestApplication } from '@nestjs/common';

describe('Health', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET healthz`, () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.uptime).toBe('number')
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
