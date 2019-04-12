const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { signInWithEmailAndPassword } = require('../services/firebase');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await signInWithEmailAndPassword({
        email: req.body.email,
        password: req.body.password,
    })
        .catch(() => {
            return res.status(400).send('Invalid email or password.');
        });

    return res.status(200).send(user.data);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().max(1024).required(),
    };

    return Joi.validate(req, schema);
}

module.exports = router;