require('dotenv').config();
const request = require('supertest');
const { signInWithEmailAndPassword, createSessionCookie } = require('../../src/services/firebase-auth');

describe('/api/category', () => {
    let server;
    let sessionCookie;

    beforeAll(async () => {
        server = require('../../index');

        const user = await signInWithEmailAndPassword({
            email: process.env.TEST_EMAIL,
            password: process.env.TEST_PASSWORD
        });

        const idToken = await user.user.getIdToken();
        sessionCookie = await createSessionCookie(idToken);
    });

    afterAll(async () => {
        await server.close();
    });

    describe('POST /', () => {
        let title;

        const exec = async () => {
            return await request(server)
                .post('/api/category')
                .set('Cookie', `session=${sessionCookie}`)
                .set('Accept', 'application/json')
                .send({ title });
        };

        it('returns a 400 response if it fails validation', async () => {
            title = 'a';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns a 200 request with the category title', async () => {
            title = 'Test Category';

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(title);
        });
    });
});