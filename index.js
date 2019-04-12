const express = require('express');

require('dotenv').config();
require('express-async-errors');

const app = express();
const port = process.env.PORT || 3000;

require('./startup/db')();
require('./startup/logger')();
require('./startup/routes')(app);
require('./startup/aws')();
require('./startup/validation')();

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;