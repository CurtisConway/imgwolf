const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createData, getData, setData } = require('../services/firebase-db');
const { uploadImage } = require('../services/aws-s3');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('file'), async (req, res) => {
    const {error} = validateImage({
        title: req.body.title,
        tags: req.body.tags,
        filesize: req.file.size,
        mimetype: req.file.mimetype,
    });
    if(error) return res.status(400).send(error.details[0].message);

    const collection = req.body.collection;
    const data = await createData({
        title: req.body.title,
        tags: req.body.tags,
        filesize: req.file.size,
        mimetype: req.file.mimetype,
    }, collection);

    let image;
    try{
        image = await uploadImage({
            title: data.key,
            file: req.file,
            collection: collection,
        });
    } catch(ex){
        return res.status(500).send('Image failed to upload.');
    }

    await setData(data.key, collection, {
        source: image.Location,
        path: image.key,
    });

    const post = await getData(collection + '/' + data.key);

    return res.status(200).send({ id: data.key, data: post.val() });
});

function validateImage(image){
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        tags: Joi.array().items(Joi.string()).required(), // Must contain at least 1 tag
        filesize: Joi.number().max(10485760).required().error(() => 'File too large.'),
        mimetype: Joi.string().regex(/image\/.*/).required().error(() => 'Invalid file type.'),
    };

    return Joi.validate(image, schema);
}

module.exports = router;