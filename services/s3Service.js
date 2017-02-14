'use strict';

const config = require('config');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'fidelity.mdn.transition';
const uuid = require ('uuid');
const appRoot = require('app-root-path');
const ShortenService = require(appRoot + '/services/shortenService');

class S3Service {
   constructor(){
   }

   sendTransitionData(key, transitionData, policyId) {
     let shortenService = new ShortenService();

     return shortenService.shorten(`${config.policyDetailUrl} + ${policyId}`).then((response) => {
       transitionData.metadata.url = response;
       console.log(transitionData);

       let id = uuid.v1().toString();
       s3.putObject({
         Bucket: bucketName,
         Key: id,
         ACL:'public-read',
         ContentType:"application/json",
         Body: new Buffer(JSON.stringify(transitionData))
       }, function (putErr, putData) {
            if ( putErr ){
              console.log(putErr);
              return putErr;
            } else{
              return putData;
            }
       });
     });
    }
}

module.exports = S3Service;
