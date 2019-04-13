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
});