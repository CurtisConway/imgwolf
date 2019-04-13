const mongoose = require('mongoose');

module.exports = async function () {
    await mongoose.connect(process.env.DB_HOST, {
        useNewUrlParser: true
    });
};