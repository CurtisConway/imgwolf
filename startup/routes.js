const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const auth = require('../src/routes/auth');
const user = require('../src/routes/user');
const image = require('../src/routes/image');
const category = require('../src/routes/category');
const error = require('../src/middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));
    app.use(helmet());
    app.use(cookieParser());

    app.use('/api/auth', auth);
    app.use('/api/user', user);
    app.use('/api/image', image);
    app.use('/api/category', category);

    app.use(error);
};