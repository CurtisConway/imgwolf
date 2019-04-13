require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// require('./startup/db')();
require('./startup/logger')();
require('./startup/firebase')();
require('./startup/routes')(app);
require('./startup/aws')();
require('./startup/validation')();

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;