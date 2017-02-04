'use strict';

const assert = require('chai').assert;
const S3Service = require('../services/s3Service');
const uuid = require ('uuid');
const S3 = require('workers/libs/S3');

/**
 * Tenant model
 * Save test
 */
describe('s3Service:send', () => {

  before((done) => {
    done();
    });

 let testData = { "name"  :  "John" };
 let s = testData.name;//uuid.v1().toString()"";

 let s3Service = new S3(null);
  it('Sending data to S3.', (done) => {
     s3Service.putObject("fidelity.mdn.transition", s, testData).then((result) => {
      console.log("result" + result);
      assert(result, result);
      done();
    }).catch((err) => {
      console.log(err);
      assert(err === null, "Failure did not occur");
      done();
       });
    });

  after(() => {

  });
});
