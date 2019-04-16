const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
});

const CategoryModel = mongoose.model('Category', categorySchema);

function validateCategory(category){
    const schema = {
        title: Joi.string().min(5).max(50).required(),
    };

    return Joi.validate(category, schema);
}

module.exports.categorySchema = categorySchema;
module.exports.CategoryModel = CategoryModel;
module.exports.validateCategory = validateCategory;