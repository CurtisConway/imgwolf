const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { ImageModel, validateImage } = require('../models/image');
const { create, index, show } = require('../controllers/image');

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('file'), create);

router.get('/', auth, index);

router.get('/:id', auth, show);

module.exports = router;