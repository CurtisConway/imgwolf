const admin = require('firebase-admin');

const db = admin.database();

/**
 * Create an item in the database
 *
 * @param data {Object}
 * @param collection {String}
 * @returns {Promise}
 */
async function createData(data, collection){
    const ref = db.ref(collection);

    return ref.push(data);
}

/**
 * Get an item in the database
 *
 * @param id {String}
 * @returns {Promise}
 */
async function getData(id){
    const ref = db.ref(id);

    return ref.once('value');
}

/**
 * Set an items properties in the database
 *
 * @param data {Object}
 * @param key {String}
 * @param collection {String}
 * @returns {Promise}
 */
async function setData(key, collection, data){
    const ref = db.ref(collection + '/' + key);

    return ref.update(data);
}

/**
 * Delete a collection
 *
 * @param collection {String}
 * @returns {Promise}
 */
async function deleteCollection(collection){
    const ref = db.ref(collection);

    return ref.remove();
}

module.exports.createData = createData;
module.exports.getData = getData;
module.exports.setData = setData;
module.exports.deleteCollection = deleteCollection;