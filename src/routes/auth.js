const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { signInWithEmailAndPassword, createSessionCookie } = require('../services/firebase');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await signIn(req, res);
    if(!user){
        return res.status(400).send('Invalid email or password.');
    }

    const idToken = await getIdToken(user.user);
    if(!idToken){
        return res.status(500).send('Something went wrong on the server.');
    }

    const sessionCookie = await createSessionCookie(idToken);
    const sessionOptions = {
        maxAge: Number(process.env.FIREBASE_SESSION_DURATION),
        httpOnly: true,
        secure: true
    };

    return res
        .cookie('session', sessionCookie, sessionOptions)
        .status(200)
        .send(user);
});

async function signIn(req, res){
    try {
        return await signInWithEmailAndPassword({
            email: req.body.email,
            password: req.body.password,
        });
    } catch(ex){
        return null;
    }
}

async function getIdToken(user){
    if(user.getIdToken != null){
        return await user.getIdToken();
    }

    return null;
}

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().max(1024).required(),
    };

    return Joi.validate(req, schema);
}

module.exports = router;