const Joi = require('joi');
const { getUserByUid, updateUserByUid } = require('../services/firebase-auth');

const UserController = {
    /**
     * Get the current user
     *
     * @returns {response}
     */
    show: async (req, res) => {
        let user;
        try {
            user = await getUserByUid(req.currentUserId);
        } catch(err){
            return res.status(404).send('User Not Found');
        }

        return res.status(200).send({
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                verified: user.emailVerified,
            }
        });
    },

    /**
     * Update the current user
     *
     * @returns {response}
     */
    update: async (req, res) => {
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        let user;
        try {
            user = await updateUserByUid(req.currentUserId, req.body);
        } catch(err){
            return res.status(404).send('User Not Found');
        }

        return res.status(200).send({
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                verified: user.emailVerified,
            }
        });
    },
};

function validate(req){
    const schema = {
        displayName: Joi.string().min(3).max(50),
        photoURL: Joi.string().max(1024).uri(),
    };

    return Joi.validate(req, schema);
}

module.exports = UserController;