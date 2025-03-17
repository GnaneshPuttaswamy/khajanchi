import request from 'supertest';
import app from '../../index.js';
import { describe, it, expect } from '@jest/globals';

describe('Health Check API', () => {
  it('should return 200 and correct response structure', async () => {
    const response = await request(app).get('/api/v1/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      version: 'v1',
      service: 'khajanchi-backend',
    });
    expect(response.body.timestamp).toBeDefined();
  });
});
