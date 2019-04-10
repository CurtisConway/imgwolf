const express = require('express');
// const AWS = require('aws-sdk');

require('dotenv').config();
require('express-async-errors');

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

const app = express();
const port  = process.env.PORT || 3000;

require('./startup/db')();
require('./startup/logger')();
require('./startup/routes')(app);
require('./startup/validation')();

const server = app.listen(port, () => console.log(`Listening on port ${ port }...`));

module.exports = server;