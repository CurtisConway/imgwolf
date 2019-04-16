const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { create, index, show, update, remove } = require('../controllers/category');

router.post('/', auth, create);

router.get('/', auth, index);

router.get('/:category', auth, show);

router.patch('/:category', auth, update);

router.delete('/:category', auth, remove);

module.exports = router;