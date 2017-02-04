'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'fidelity.mdn.transition';
const uuid = require ('uuid');

class S3Service {
   constructor(){
   }

   sendTransitionData(key, transitionData) {
     let p = new Promise((resolve, reject) =>  {
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
              reject(putErr);
            } else{
              console.log(putData);
              resolve(putData);
            }
       });

  });
    return p;
 }
}

module.exports = S3Service;
