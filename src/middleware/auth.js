const { verifySessionCookie } = require('../services/firebase');

module.exports = async function (req, res, next) {
    const cookies = req.cookies;
    if(!cookies.session) return res.status(401).send('Access denied. No cookie provided.');

    let user;
    try {
        user = await verifySessionCookie(cookies.session);
    } catch(ex){
        if(ex.code === 'auth/session-cookie-expired'){
            return res.status(403).send('Session Expired. Please Log in Again.');
        }

        return res.status(401).send('Access denied. User not authorized.');
    }

    req.currentUserId = user.uid;
    next();
};