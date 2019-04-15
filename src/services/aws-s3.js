const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: 'imgwolf'
    }
});

/**
 * Upload an image to S3
 *
 * @param data {Object}
 * @returns {Promise}
 */
async function uploadImage({title, file}){
    const uploadedFile = await readFile(file);
    const imageExtension = file.mimetype.split('/')[1];

    fs.unlink(file.path, (err) => { if(err) new Error('Failed to delete temporary file')});

    return await s3Upload({
        key: `imgwolf/${title}.${imageExtension}`,
        body: uploadedFile
    });
}

/**
 * Delete an image on s3
 *
 * @param path {String}
 * @returns {Promise}
 */
async function deleteImage(path){
    return new Promise((resolve, reject) => {
        s3.deleteObject({Key: path}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Promise wrapper around the fs.readFile method
 *
 * @param file {Object}
 * @returns {Promise}
 */
function readFile(file){
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, (err, data) => {
            if(err){
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Promise wrapper around the s3 upload method
 *
 * @param key {String}
 * @param body {File}
 * @returns {Promise}
 */
function s3Upload({key, body}){
    return new Promise((resolve, reject) => {
        s3.upload({Key: key, Body: body, ACL: 'public-read'}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports.uploadImage = uploadImage;
module.exports.deleteImage = deleteImage;