'use strict';
const debug = require('debug')('policy-controller');
const appRoot = require('app-root-path');

const HttpStatus = require('http-status');
const policyModel = require('model').model;
const ServiceError = require('core-server').ServiceError;
const Policy = policyModel.Policy;

const PolicyService = require(appRoot + '/services/policyService');
const S3Service = require(appRoot + '/services/s3Service');

/**
 * Build Page Descriptor
 */
const buildPageDescriptor = (query) => {
  return {
    page: query.page || 0,
    size: query.size || 10
  }
}

const findPolicies = (app) => {
  return (req, res) => {
    let url = require('url');
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let search = query.search;
    let pageDescriptor = buildPageDescriptor(query);
    let policyService = new PolicyService();

    policyService.findPolicies(search, pageDescriptor).then((page) => {
      res.status(HttpStatus.OK).send(page);
    }).catch((err) => {
      new ServiceError(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
    });
  }
}


const findPolicy = (app) => {
  return (req, res) => {
    let id = req.params.id;
    // validate id requirements.  If invalid return BAD_REQUEST
    let policyService = new PolicyService();
    policyService.findPolicyById(id).then((result) => {
       if(result) {
         res.status(HttpStatus.OK).send(result);
       } else {
         new ServiceError(HttpStatus.NOT_FOUND, "Not found").writeResponse(res);
       }
     }).catch((err) => {
       let errResponse = new ServiceError(HttpStatus.INTERNAL_SERVER_ERROR, err.message);
       console.log(errResponse.toJSON());
       errResponse.writeResponse(res);
    });
  }
}

const savePolicy = (app) => {
  return (req, res) => {
    let policy = req.body;
    let policyService = new PolicyService();

    policyService.savePolicy(policy).then((result) => {
       console.log(result);
       res.status(HttpStatus.OK).send(result);
     }).catch((err) => {
        new Error(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
    });
 }
}

const updatePolicy = (app) => {
  return (req, res) => {
    let policy = req.body;
    let policyService = new PolicyService();
    let policyId = policy.id;

    policyService.findPolicyById(policyId).then((result) => {
        if (result ){
          policyService.updatePolicy(policy).then((doc) => {
             // Data updated. Send notifications to interested parties
             if ( doc.status != result.status  ){
                 sendMessage(result, doc).then((s3data) => {
             }).catch((err) => {
                 console.log(err);
              });
            }
            res.status(HttpStatus.OK).send(doc);

           }).catch((err) => {
             console.log(err);
              new Error(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
          });
        } else {
          new Error(HttpStatus.BAD_REQUEST, err.message).writeResponse(res);
        }
    }).catch((err) => {
      new Error(HttpStatus.OK, err.message).writeResponse(res);
    });
  }
}


const sendMessage = (fromPolicy, toPolicy) =>  {
  console.log("sending message to S3");
     let p = new Promise((resolve, reject) =>  {
        let service = new S3Service();
        let key = fromPolicy.policyNumber;
        console.log(key);
        let transitionData = {
            "from" : fromPolicy.status,
            "to" : toPolicy.status,
            "interestedParties" : [
              {
                "role" : "buyer",
                "firstName" : toPolicy.buyer.firstName,
                "lastName" : toPolicy.buyer.lastName,
                "email" : toPolicy.buyer.email,
                "sms" : toPolicy.buyer.phone
              },
              {
                "role" : "seller",
                "firstName" : toPolicy.seller.firstName,
                "lastName" : toPolicy.seller.lastName,
                "email" : toPolicy.seller.email,
                "sms" : toPolicy.seller.phone
              },
              {
                "role" : "agent",
                "firstName" : toPolicy.agent.firstName,
                "lastName" : toPolicy.agent.lastName,
                "email" : toPolicy.agent.email,
                "sms" : toPolicy.agent.phone
              },
              {
                "role" : "lender",
                "firstName" : toPolicy.lender.firstName,
                "lastName" : toPolicy.lender.lastName,
                "email" : toPolicy.lender.email,
                "sms" : toPolicy.lender.phone
              }
          ]
        };

        service.sendTransitionData(key, transitionData).then((ret) => {
            console.log(ret);
        }).catch((err) => {
            console.log(err);
      });
    });
    return p;
}

exports.findPolicy = findPolicy;
exports.findPolicies = findPolicies;
exports.savePolicy = savePolicy;
exports.updatePolicy = updatePolicy;
