require('dotenv').config();
const request = require('supertest');
const { signInWithEmailAndPassword, createSessionCookie } = require('../../src/services/firebase-auth');

describe('/api/image', () => {
    let server;
    let sessionCookie;
    let imagePath;

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

    afterAll(async () => {
        const { deleteCollection } = require('../../src/services/firebase-db');
        await deleteCollection('test');

        const { deleteImage } = require('../../src/services/aws-s3');
        await deleteImage(imagePath);
    });

    describe('POST /', () => {
        const exec = async () => {
            return await request(server)
                .post('/api/image')
                .set('Cookie', `session=${sessionCookie}`)
                .field('title', 'Test Title')
                .field('tags[]', 'test1')
                .field('tags[]', 'test2')
                .field('collection', 'test')
                .attach('file', 'tests/integration/test-image.png');
        };

        it('returns a 403 response with an expired session cookie', async () => {
            sessionCookie = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNrSUJOZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9pbWd3b2xmIiwiYXVkIjoiaW1nd29sZiIsImF1dGhfdGltZSI6MTU1NTEyNzkzOCwidXNlcl9pZCI6ImVUVlRvbTNmUFJVeXRiYWxHNXF6RzREUnlScDEiLCJzdWIiOiJlVFZUb20zZlBSVXl0YmFsRzVxekc0RFJ5UnAxIiwiaWF0IjoxNTU1MTI3OTM5LCJleHAiOjE1NTUxMjgyOTksImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Zor0cWwKa4k1fnsYlZSheGxdpC8njd1wqx5bdM4dvFK1D0BRAhYllwPQ3gB1Zqr4RDnzYK9_ths_WWqGgdwoi1YlK2CuMcR3TIonAK5XSchn65RGzlWoylqeM7RFfWN0gMJyRw4ylO69Sy3y5XO5m8DD_BSII_KvYXpUVm2R4JrUv049vjduBcWgRZUy2gHG4_TYKpCUUPa8Coiqx3iJ1pE7jGJ5TPdRqdInnjHy7SGK0YONM_sHDRekw5hm6EululD9hgJZIyiNxRtde8udFL_zCFWenmyxGuSNc1NgQVN8ushoZ1-fxWuPdIhlLWuDe9_SifajModHQ1AAaqksCA';

            const response = await exec();

            expect(response.status).toBe(403);
        });

        it('returns a 200 response with newly created data', async () => {

            const response = await exec();

            // Set the image path so it can be deleted later
            imagePath = response.body.data.path;

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('title');
            expect(response.body.data).toHaveProperty('tags');
            expect(response.body.data).toHaveProperty('source');
            expect(response.body.data).toHaveProperty('filesize');
            expect(response.body.data).toHaveProperty('mimetype');
        });
    });
});