const express = require('express');
const helmet = require('helmet');
const auth = require('../src/routes/auth');
const error = require('../src/middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));
    app.use(helmet());

    app.use('/api/auth', auth);

    app.use(error);
};