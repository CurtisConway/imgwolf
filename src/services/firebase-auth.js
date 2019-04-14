const firebaseAuth = require('firebase');
const admin = require('firebase-admin');

/**
 * Sign in with Firebase email and password
 *
 * @param email {String}
 * @param password {String}
 * @returns {Promise}
 */
function signInWithEmailAndPassword({email, password}) {
    return firebaseAuth.auth().signInWithEmailAndPassword(email, password);
}

/**
 * Generate a password reset email link for a user
 *
 * @param email {String}
 * @returns {Promise}
 */
async function sendPasswordResetEmail(email){
    return firebaseAuth.auth().sendPasswordResetEmail(email, {
        url: process.env.APP_FRONTEND_UI_URL
    });
}

/**
 * Create a session cookie with a user id token
 *
 * @param idToken {String}
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
 * @param cookie {String}
 * @returns {Promise}
 */
function verifySessionCookie(cookie){
    return admin.auth().verifySessionCookie(cookie, true);
}


/**
 * Get user by uid
 *
 * @param uid {String}
 * @returns {Promise}
 */
async function getUserByUid(uid){
    return admin.auth().getUser(uid);
}


/**
 * Get user by email
 *
 * @param email {String}
 * @returns {Promise}
 */
async function getUserByEmail(email){
    return admin.auth().getUserByEmail(email);
}


/**
 * Update user by uid
 *
 * @param uid {String}
 * @param properties {Object}
 * @returns {Promise}
 */
async function updateUserByUid(uid, properties = {}){
    return admin.auth().updateUser(uid, properties);
}

module.exports = {
    signInWithEmailAndPassword,
    createSessionCookie,
    verifySessionCookie,
    getUserByUid,
    getUserByEmail,
    updateUserByUid,
    sendPasswordResetEmail,
};

