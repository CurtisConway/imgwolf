require('dotenv').config();
const request = require('supertest');
const { signInWithEmailAndPassword, createSessionCookie } = require('../../src/services/firebase-auth');
const { ImageModel } = require('../../src/models/image');

describe('/api/image', () => {
    let server;
    let sessionCookie;
    let imagePath; // Will be used to delete the s3 image after tests are done
    let imageId; // Used to request the image uploaded in earlier tests

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
        await ImageModel.findOneAndDelete({_id: imageId});

        const { deleteImage } = require('../../src/services/aws-s3');
        await deleteImage(imagePath);

        await server.close();
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

        it('returns a 200 response with newly created data', async () => {

            const response = await exec();

            // Set the image path so it can be deleted later
            imagePath = response.body.path;
            imageId = response.body._id;

            expect(response.status).toBe(200);
            expect(response.body)
                .toHaveProperty(
                    '_id', 'title', 'tags', 'source', 'filesize', 'mimetype', 's3Key', 'createdAt'
                );
        });
    });

    describe('GET /', () => {
        const exec = async () => {
            return await request(server)
                .get(`/api/image/`)
                .set('Cookie', `session=${sessionCookie}`)
                .set('Accept', 'application/json')
                .send();
        };

        it('returns a 200 response and images', async () => {
            const response = await exec();

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0])
                .toHaveProperty(
                    '_id', 'title', 'tags', 'source', 'filesize', 'mimetype', 's3Key', 'createdAt'
                );
        });
    });

    describe('GET /id', () => {
        let id;

        const exec = async () => {
            return await request(server)
                .get(`/api/image/${id}`)
                .set('Cookie', `session=${sessionCookie}`)
                .set('Accept', 'application/json')
                .send();
        };

        it('returns a 200 response and the image data with a valid id', async () => {
            id = imageId;

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body)
                .toHaveProperty(
                    '_id', 'title', 'tags', 'source', 'filesize', 'mimetype', 's3Key', 'createdAt'
                );
        });

        it('returns a 404 response with an invalid id', async () => {
            id = 'abc';

            const response = await exec();

            expect(response.status).toBe(404);
        });
    });
});