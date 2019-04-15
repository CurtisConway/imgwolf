const mongoose = require('mongoose');
const Joi = require('joi');

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    mimetype: {
        type: String,
        required: true,
    },
    filesize: {
        type: Number,
        required: true,
        max: 10485760, // 10 MB
    },
    source: {
        type: String,
        required: true,
        maxlength: 1024,
    },
    path: {
        type: String,
        required: true,
        maxlength: 1024,
    },
    tags: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const ImageModel = mongoose.model('Image', imageSchema);

function validateImage(image){
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        tags: Joi.array().items(Joi.string()).required(), // Must contain at least 1 tag
        filesize: Joi.number().max(10485760).required().error(() => 'File too large.'),
        mimetype: Joi.string().regex(/image\/.*/).required().error(() => 'Invalid file type.'),
    };

    return Joi.validate(image, schema);
}

exports.validateImage = validateImage;
exports.imageSchema = imageSchema;
exports.ImageModel = ImageModel;