const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { show, update } = require('../controllers/user');

router.get('/', auth, show);

router.post('/update', auth, update);

module.exports = router;

