require('dotenv').config();
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('/api/auth', () => {

    describe('POST /', () => {
        let server;

        let email;
        let password;

        const exec = async () => {
            return await request(server)
                .post('/api/auth')
                .send({ email, password })
                .set('Accept', 'application/json');
        };

        beforeEach(() => {
            server = require('../../index');
        });
        afterEach(() => {
            server.close();
        });

        it('returns 400 if validation fails', async () => {
            email = 'abc';
            password = 'abc';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns 400 if user does not exist', async () => {
            email = 'abc@email.com';
            password = 'password';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns 400 if email/password combination is invalid', async () => {
            email = 'test@email.com';
            password = 'wrongpassword';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns a 200 response with a valid JWT on successful login', async () => {
            email = 'test@email.com';
            password = 'password';

            const response = await exec();

            const jwtDecoded = jwt.verify(response.body.token, process.env.JWT_PRIVATE_KEY);

            expect(jwtDecoded).toHaveProperty('_id', 'iat', 'isAdmin');
            expect(response.status).toBe(200);
        });
    });
});