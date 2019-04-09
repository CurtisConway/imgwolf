// const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const Joi = require('joi');
// const bcrypt = require('bcrypt');

// const { User } = require('../models/user');

router.post('/', async (req, res) => {
    console.log(req.body);

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    res.status(200).send('foo');
});

function validate(req){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(1024).required(),
    };

    return Joi.validate(req, schema);
}

module.exports = router;