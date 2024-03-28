import request from 'supertest'
import app from "../src/app"

describe('Testando Rotas', () => {
    it('Deve estar off', async () => {
      const response = await request(app).get('/upload"');
  
      expect(response.status).toBe(404);
    });

  });