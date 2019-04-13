const admin = require('firebase-admin');
const firebase = require("firebase/app");
require("firebase/auth");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

module.exports = function(){
    firebase.initializeApp(firebaseConfig);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://imgwolf.firebaseio.com"
    });
};