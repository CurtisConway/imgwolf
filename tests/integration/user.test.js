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

        it('returns a 403 response with an expired session cookie', async () => {
            sessionCookie = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNrSUJOZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9pbWd3b2xmIiwiYXVkIjoiaW1nd29sZiIsImF1dGhfdGltZSI6MTU1NTEyNzkzOCwidXNlcl9pZCI6ImVUVlRvbTNmUFJVeXRiYWxHNXF6RzREUnlScDEiLCJzdWIiOiJlVFZUb20zZlBSVXl0YmFsRzVxekc0RFJ5UnAxIiwiaWF0IjoxNTU1MTI3OTM5LCJleHAiOjE1NTUxMjgyOTksImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Zor0cWwKa4k1fnsYlZSheGxdpC8njd1wqx5bdM4dvFK1D0BRAhYllwPQ3gB1Zqr4RDnzYK9_ths_WWqGgdwoi1YlK2CuMcR3TIonAK5XSchn65RGzlWoylqeM7RFfWN0gMJyRw4ylO69Sy3y5XO5m8DD_BSII_KvYXpUVm2R4JrUv049vjduBcWgRZUy2gHG4_TYKpCUUPa8Coiqx3iJ1pE7jGJ5TPdRqdInnjHy7SGK0YONM_sHDRekw5hm6EululD9hgJZIyiNxRtde8udFL_zCFWenmyxGuSNc1NgQVN8ushoZ1-fxWuPdIhlLWuDe9_SifajModHQ1AAaqksCA';

            const response = await exec();

            expect(response.status).toBe(403);
        });

        it('returns a 200 response with user details', async () => {
            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.user).toHaveProperty('uid');
            expect(response.body.user).toHaveProperty('email');
            expect(response.body.user).toHaveProperty('displayName');
            expect(response.body.user).toHaveProperty('photoURL');
            expect(response.body.user).toHaveProperty('verified');
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

        it('returns a 403 response with an expired session cookie', async () => {
            sessionCookie = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNrSUJOZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9pbWd3b2xmIiwiYXVkIjoiaW1nd29sZiIsImF1dGhfdGltZSI6MTU1NTEyNzkzOCwidXNlcl9pZCI6ImVUVlRvbTNmUFJVeXRiYWxHNXF6RzREUnlScDEiLCJzdWIiOiJlVFZUb20zZlBSVXl0YmFsRzVxekc0RFJ5UnAxIiwiaWF0IjoxNTU1MTI3OTM5LCJleHAiOjE1NTUxMjgyOTksImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Zor0cWwKa4k1fnsYlZSheGxdpC8njd1wqx5bdM4dvFK1D0BRAhYllwPQ3gB1Zqr4RDnzYK9_ths_WWqGgdwoi1YlK2CuMcR3TIonAK5XSchn65RGzlWoylqeM7RFfWN0gMJyRw4ylO69Sy3y5XO5m8DD_BSII_KvYXpUVm2R4JrUv049vjduBcWgRZUy2gHG4_TYKpCUUPa8Coiqx3iJ1pE7jGJ5TPdRqdInnjHy7SGK0YONM_sHDRekw5hm6EululD9hgJZIyiNxRtde8udFL_zCFWenmyxGuSNc1NgQVN8ushoZ1-fxWuPdIhlLWuDe9_SifajModHQ1AAaqksCA';

            const response = await exec();

            expect(response.status).toBe(403);
        });

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
            expect(response.body.user).toHaveProperty('uid');
            expect(response.body.user).toHaveProperty('email');
            expect(response.body.user).toHaveProperty('displayName');
            expect(response.body.user).toHaveProperty('photoURL');
            expect(response.body.user).toHaveProperty('verified');
        });
    });
});