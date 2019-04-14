const AWS = require('aws-sdk');

module.exports = function(){
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1',
        apiVersion: '2014-10-01',
    });
};