const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUser } = require('../services/firebase');

router.get('/', auth, async (req, res) => {
    let user;

    try {
        user = await getUser(req.currentUserId);
    } catch(err){
        return res.status(404).send('User Not Found');
    }

    return res.status(200).send({user});
});

module.exports = router;

