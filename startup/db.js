const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect(process.env.DB_HOST, {
        useNewUrlParser: true
    })
        .then(() => console.log(`Connected to ${ process.env.DB_HOST }..`));
};