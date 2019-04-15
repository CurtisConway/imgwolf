const auth = require('../../../src/middleware/auth');

describe('auth middleware', () => {
    let sessionCookie;
    let server;

    // Stub a request object with a response
    const exec = () => {
        let req = {
            cookies: {
                session: sessionCookie
            }
        };
        const res = {
            status: (status) => {
                return {
                    send(body){
                        return {
                            status: status,
                            body: body
                        }
                    }
                }
            },
        };
        const next = jest.fn();

        return auth(req, res, next);
    };

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(() => {
        server.close();
    });

    it('returns a 403 response with an expired session cookie', async () => {
        sessionCookie = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNrSUJOZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9pbWd3b2xmIiwiYXVkIjoiaW1nd29sZiIsImF1dGhfdGltZSI6MTU1NTEyNzkzOCwidXNlcl9pZCI6ImVUVlRvbTNmUFJVeXRiYWxHNXF6RzREUnlScDEiLCJzdWIiOiJlVFZUb20zZlBSVXl0YmFsRzVxekc0RFJ5UnAxIiwiaWF0IjoxNTU1MTI3OTM5LCJleHAiOjE1NTUxMjgyOTksImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Zor0cWwKa4k1fnsYlZSheGxdpC8njd1wqx5bdM4dvFK1D0BRAhYllwPQ3gB1Zqr4RDnzYK9_ths_WWqGgdwoi1YlK2CuMcR3TIonAK5XSchn65RGzlWoylqeM7RFfWN0gMJyRw4ylO69Sy3y5XO5m8DD_BSII_KvYXpUVm2R4JrUv049vjduBcWgRZUy2gHG4_TYKpCUUPa8Coiqx3iJ1pE7jGJ5TPdRqdInnjHy7SGK0YONM_sHDRekw5hm6EululD9hgJZIyiNxRtde8udFL_zCFWenmyxGuSNc1NgQVN8ushoZ1-fxWuPdIhlLWuDe9_SifajModHQ1AAaqksCA';

        const response = await exec();

        expect(response.status).toBe(403);
    });
});