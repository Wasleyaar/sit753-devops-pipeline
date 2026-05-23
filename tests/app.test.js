const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {

    test('GET / should return success message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });

    test('GET /health should return OK', async () => {
        const res = await request(app).get('/health');
        expect(res.body.status).toBe('OK');
    });

});