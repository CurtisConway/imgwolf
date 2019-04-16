const { CategoryModel, validateCategory } = require('../models/category');

const CategoryController = {
    create: async (req, res) => {
        const {error} = validateCategory(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }

        return res.status(200).send(req.body);
    },

    index: async (req, res) => {

    },

    show: async (req, res) => {

    },

    update: async (req, res) => {

    },

    remove: async (req, res) => {

    },
};

module.exports = CategoryController;