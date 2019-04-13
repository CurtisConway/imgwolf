const request = require('supertest');

describe('/api/auth', () => {

    describe('POST /', () => {
        let server;

        let email;
        let password;

        const exec = async () => {
            return await request(server)
                .post('/api/auth')
                .set('Accept', 'application/json')
                .send({ email, password });
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

        it('returns a 200 response with a session cookie on successful login', async () => {
            email = 'test@email.com';
            password = 'password';

            const response = await exec();

            expect(response.headers['set-cookie'][0]).toContain('session');
            expect(response.status).toBe(200);
        });
    });

    describe('POST /reset', () => {
        let server;
        let email;

        const exec = async () => {
            return await request(server)
                .post('/api/auth/reset')
                .set('Accept', 'application/json')
                .send({
                    email: email
                });
        };

        beforeEach(() => {
            server = require('../../index');
        });
        afterEach(() => {
            server.close();
        });

        it('returns a 400 response if the input is not an email', async () => {
            email = 'abc';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns a 404 response if the user does not exist', async () => {
            email = 'abc@email.com';

            const response = await exec();

            expect(response.status).toBe(404);
        });

        it('returns a 200 response with a reset link if the user exists', async () => {
            email = process.env.MY_EMAIL;

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('resetLink');
        });
    });
});