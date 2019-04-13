const request = require('supertest');
const { signInWithEmailAndPassword, createSessionCookie } = require('../../src/services/firebase');

describe('/api/user', () => {
    let server;
    let sessionCookie;

    const exec = async () => {
        return await request(server)
            .get('/api/user')
            .set('Cookie', `session=${sessionCookie}`)
            .set('Accept', 'application/json')
            .send();
    };

    beforeEach(async () => {
        server = require('../../index');

        const user = await signInWithEmailAndPassword({
            email: 'test@email.com',
            password: 'password'
        });

        const idToken = await user.user.getIdToken();
        sessionCookie = await createSessionCookie(idToken);
    });

    afterEach(async () => {
        await server.close();
    });

    describe('GET /', () => {
        it('returns a 401 response with no idToken', async () => {
            sessionCookie = '';
            const response = await exec();

            expect(response.status).toBe(401);
        });

        it('returns a 403 response an expired idToken', async () => {
            sessionCookie = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNrSUJOZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9pbWd3b2xmIiwiYXVkIjoiaW1nd29sZiIsImF1dGhfdGltZSI6MTU1NTEyNzkzOCwidXNlcl9pZCI6ImVUVlRvbTNmUFJVeXRiYWxHNXF6RzREUnlScDEiLCJzdWIiOiJlVFZUb20zZlBSVXl0YmFsRzVxekc0RFJ5UnAxIiwiaWF0IjoxNTU1MTI3OTM5LCJleHAiOjE1NTUxMjgyOTksImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Zor0cWwKa4k1fnsYlZSheGxdpC8njd1wqx5bdM4dvFK1D0BRAhYllwPQ3gB1Zqr4RDnzYK9_ths_WWqGgdwoi1YlK2CuMcR3TIonAK5XSchn65RGzlWoylqeM7RFfWN0gMJyRw4ylO69Sy3y5XO5m8DD_BSII_KvYXpUVm2R4JrUv049vjduBcWgRZUy2gHG4_TYKpCUUPa8Coiqx3iJ1pE7jGJ5TPdRqdInnjHy7SGK0YONM_sHDRekw5hm6EululD9hgJZIyiNxRtde8udFL_zCFWenmyxGuSNc1NgQVN8ushoZ1-fxWuPdIhlLWuDe9_SifajModHQ1AAaqksCA';

            const response = await exec();

            expect(response.status).toBe(403);
        });

        it('returns a 401 response an invalid idToken', async () => {
            sessionCookie = 'abc';
            const response = await exec();

            expect(response.status).toBe(401);
        });

        it('returns a 200 response with a valid idToken and user details', async () => {
            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.user).toHaveProperty('uid');
            expect(response.body.user).toHaveProperty('email');
        });
    });
});