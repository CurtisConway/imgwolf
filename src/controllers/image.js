const { ImageModel, validateImage } = require('../models/image');
const { uploadImage } = require('../services/aws-s3');

const ImageController = {
    /**
     * Create an image
     *
     * @returns {response}
     */
    create: async (req, res) => {
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
    },

    /**
     * Get all images paginated
     *
     * @returns {response}
     */
    index: async (req, res) => {
        const acceptedSortValueParams =
            ['title', 'createdAt', 'filesize', 'mimetype', '-title', '-createdAt', '-filesize', '-mimetype'];
        const sortValue = acceptedSortValueParams.indexOf(req.query.sort) !== -1 ? req.query.sort : 'createdAt';

        const limit = req.query.limit || 20;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;

        const images = await ImageModel
            .find()
            .sort(sortValue)
            .limit(limit)
            .skip(skip);

        return res.status(200).send(images);
    },

    /**
     * Get image by ID
     *
     * @returns {response}
     */
    show: async (req, res) => {
        let image;
        try {
            image = await ImageModel.findOne({_id: req.params.id});
        } catch(ex){
            return res.status(404).send('Image not found');
        }

        return res.status(200).send(image);
    },
};

module.exports = ImageController;