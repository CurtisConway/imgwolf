const request = require('supertest');
const { signInWithEmailAndPassword, createSessionCookie } = require('../../src/services/firebase-auth');

describe('/api/user', () => {
    let server;
    let sessionCookie;

    beforeEach(async () => {
        server = require('../../index');

        const user = await signInWithEmailAndPassword({
            email: process.env.TEST_EMAIL,
            password: process.env.TEST_PASSWORD
        });

        const idToken = await user.user.getIdToken();
        sessionCookie = await createSessionCookie(idToken);
    });

    afterEach(async () => {
        await server.close();
    });

    describe('GET /', () => {
        const exec = async () => {
            return await request(server)
                .get('/api/user')
                .set('Cookie', `session=${sessionCookie}`)
                .set('Accept', 'application/json')
                .send();
        };

        it('returns a 200 response with user details', async () => {
            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.user)
                .toHaveProperty('uid', 'email', 'displayName', 'photoUrl', 'verified');
        });
    });

    describe('POST /update', () => {
        let displayName;
        let photoURL;

        const exec = async () => {
            return await request(server)
                .post('/api/user/update')
                .set('Cookie', `session=${sessionCookie}`)
                .set('Accept', 'application/json')
                .send({displayName, photoURL});
        };

        it('returns a 400 response if display name does not pass validation', async () => {
            displayName = 'a';
            photoURL = 'https://placehold.it/250x250';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns a 400 response if photo url does not pass validation', async () => {
            displayName = 'Test User';
            photoURL = 'a';

            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('returns a 200 response with user details', async () => {
            displayName = 'Test User';
            photoURL = 'https://placehold.it/250x250';

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.user)
                .toHaveProperty('uid', 'email', 'displayName', 'photoUrl', 'verified');
        });
    });
});