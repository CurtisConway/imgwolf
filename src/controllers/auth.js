const Joi = require('joi');
const {
    signInWithEmailAndPassword,
    createSessionCookie,
    getUserByEmail,
    sendPasswordResetEmail
} = require('../services/firebase-auth');

const AuthController = {
    /**
     * Login with email and password
     *
     * @returns {response}
     */
    login: async (req, res) => {
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const user = await asyncSignIn(req, res);
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        const idToken = await getIdToken(user.user);
        if (!idToken) {
            return res.status(500).send('Something went wrong on the server.');
        }

        const sessionCookie = await createSessionCookie(idToken);
        const sessionOptions = {
            maxAge: Number(process.env.FIREBASE_SESSION_DURATION),
            httpOnly: true,
            secure: true
        };

        return res
            .cookie('session', sessionCookie, sessionOptions)
            .status(200)
            .send(user);
    },

    /**
     * Send a password reset email
     *
     * @returns {response}
     */
    reset: async (req, res) => {
        const validation = Joi.validate(req.body.email, Joi.string().min(5).max(255).required().email());
        if (validation.error) {
            return res.status(400).send(validation.error.details[0].message);
        }

        const user = await getUser(req);
        if(!user){
            return res.status(404).send('User with that email not found.');
        }

        try {
            await sendPasswordResetEmail(req.body.email);
        } catch(ex){
            return res.status(500).send(ex);
        }

        return res.status(200).send('A link has been sent to your email.');
    },
};

async function asyncSignIn(req) {
    try {
        return await signInWithEmailAndPassword({
            email: req.body.email,
            password: req.body.password,
        });
    } catch (ex) {
        return null;
    }
}

async function getIdToken(user) {
    if (user.getIdToken != null) {
        return await user.getIdToken();
    }

    return null;
}

async function getUser(req){
    try {
        return await getUserByEmail(req.body.email);
    } catch (ex) {
        return null;
    }
}


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().max(1024).required(),
    };

    return Joi.validate(req, schema);
}

module.exports = AuthController;