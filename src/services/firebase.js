const firebase = require('firebase');
const admin = require('firebase-admin');

/**
 * Sign in with Firebase email and password through the REST API
 *
 * @param email {string}
 * @param password [string}
 * @returns {Promise}
 */
function signInWithEmailAndPassword({email, password}) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

/**
 * Create a session cookie with a user id token - expires after 1 hour
 *
 * @param idToken {string}
 * @returns {Promise}
 */
function createSessionCookie(idToken){
    return admin.auth().createSessionCookie(idToken, {
        expiresIn: Number(process.env.FIREBASE_SESSION_DURATION)
    });
}

/**
 * Verify a session cookie
 *
 * @param cookie {string}
 * @returns {Promise}
 */
function verifySessionCookie(cookie){
    return admin.auth().verifySessionCookie(cookie, true);
}


/**
 * Get user by uid
 *
 * @param uid {string}
 * @returns {Promise}
 */
async function getUserByUid(uid){
    return admin.auth().getUser(uid);
}


/**
 * Get user by email
 *
 * @param email {string}
 * @returns {Promise}
 */
async function getUserByEmail(email){
    return admin.auth().getUserByEmail(email);
}


/**
 * Generate a password reset link for a user
 *
 * @param email {string}
 * @returns {Promise}
 */
async function generatePasswordResetLink(email){
    return admin.auth().generatePasswordResetLink(email, {
        url: process.env.APP_FRONTEND_UI_URL
    });
}

module.exports = {
    signInWithEmailAndPassword,
    createSessionCookie,
    verifySessionCookie,
    getUserByUid,
    generatePasswordResetLink,
    getUserByEmail,
};

