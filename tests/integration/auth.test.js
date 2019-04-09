const request = require('supertest');
const jwt = require('jsonwebtoken');
// const {User} = require('../../src/models/user');
// const mongoose = require('mongoose');

let server;

describe('/api/auth', () => {
    beforeEach(() => {
        server = require('../../index');
    });

    describe('POST /', () => {

        it('returns 400 if validation fails', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send({
                    email: 'abc',
                    password: 'abc'
                });

            expect(response.status).toBe(400);
        });

        it('returns 400 if user does not exist', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send({
                    email: 'does_not_exist@email.com',
                    password: 'password'
                });

            expect(response.status).toBe(400);
        });

        it('returns 400 if email/password combination is invalid', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send({
                    email: 'exists@email.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
        });

        it('returns a 200 response with a valid JWT on successful login', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send({
                    email: 'exists@email.com',
                    password: 'password'
                });

            const decoded = jwt.verify(response.body, process.env.JWT_PRIVATE_KEY);

            expect(decoded).toHaveProperty('_id', 'iat', 'isAdmin');
            expect(response.status).toBe(200);
        });
    });
});