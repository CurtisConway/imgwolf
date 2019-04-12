const axios = require('axios');

/**
 * Sign in with Firebase email and password through the REST API
 *
 * @param email {string}
 * @param password [string}
 * @returns {Promise}
 */
async function signInWithEmailAndPassword({email, password}) {
    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
        process.env.FIREBASE_API_KEY
        }`;

    return await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true,
    });
}

/**
 * Refresh the users session using the Firebase refresh token
 *
 * @param refreshToken {string}
 * @returns {Promise}
 */
async function refreshUserToken(refreshToken) {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;

    return await axios.post(url, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });
}

module.exports.signInWithEmailAndPassword = signInWithEmailAndPassword;
module.exports.refreshUserToken = refreshUserToken;

