const express = require('express');
const router = express.Router();
const { login, reset } = require('../controllers/auth');

router.post('/', login);

router.post('/reset', reset);

module.exports = router;