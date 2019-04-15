const auth = require('../../../src/middleware/auth');

describe('auth middleware', () => {
    let sessionCookie;
    let server;

    // Stub a request object with a response
    const exec = () => {
        let req = {
            cookies: {
                session: jest.fn().mockReturnValue(sessionCookie)
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

    it('returns a 401 response with no session cookie', async () => {
        sessionCookie = '';
        const response = await exec();

        expect(response.status).toBe(401);
    });

    it('returns a 401 response an invalid session cookie', async () => {
        sessionCookie = 'abc';
        const response = await exec();

        expect(response.status).toBe(401);
    });
});