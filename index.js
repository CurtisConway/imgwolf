const express = require('express');
const AWS = require('aws-sdk');
const helmet = require('helmet');
const auth = require('./src/routes/auth');

require('dotenv').config();
// require('express-async-errors');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const app = express();
const port  = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/auth', auth);

const server = app.listen(port, () => console.log(`Listening on port ${ port }`));

module.exports = server;