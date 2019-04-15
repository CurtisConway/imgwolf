const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadImage } = require('../services/aws-s3');
const multer = require('multer');
const { ImageModel, validateImage } = require('../models/image');

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('file'), async (req, res) => {
    const {error} = validateImage({
        title: req.body.title,
        tags: req.body.tags,
        filesize: req.file.size,
        mimetype: req.file.mimetype,
    });
    if(error) return res.status(400).send(error.details[0].message);

    const data = new ImageModel({
        title: req.body.title,
        tags: req.body.tags,
        filesize: req.file.size,
        mimetype: req.file.mimetype,
    });

    let image;
    try{
        image = await uploadImage({
            title: data._id,
            file: req.file,
        });
    } catch(ex){
        return res.status(500).send('Image failed to upload.');
    }

    data.set('source', image.Location);
    data.set('path', image.key);

    const post = await data.save();

    return res.status(200).send(post);
});

router.get('/', auth, async (req, res) => {
    const images = await ImageModel.find().sort('title');

    return res.status(200).send(images);
});

router.get('/:id', auth, async (req, res) => {
    let image;
    try {
        image = await ImageModel.findOne({_id: req.params.id});
    } catch(ex){
        return res.status(404).send('Image not found');
    }

    return res.status(200).send(image);
});

module.exports = router;