const { refreshUserToken } = require('../services/firebase');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.');

    const refresh = await refreshUserToken(token)
        .catch(err => {
            if(err.code === 'TOKEN_EXPIRED'){
                return res.status(403).send('Session Expired. Please Log in Again');
            }

            return res.status(401).send('Access denied. User not authorized.');
        });

    req.newRefreshToken = refresh.data.refresh_token;
    next();
};