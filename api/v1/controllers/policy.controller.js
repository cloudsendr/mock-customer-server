'use strict';
const debug = require('debug')('policy-controller');
const appRoot = require('app-root-path');

const HttpStatus = require('http-status');
const policyModel = require('model').model;
const ServiceError = require('core-server').ServiceError;
const Policy = policyModel.Policy;

const PolicyService = require(appRoot + '/services/policyService');

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
             res.status(HttpStatus.OK).send(doc);
           }).catch((err) => {
              new Error(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
          });
        } else {
          res.status(HttpStatus.BAD_REQUEST, "No Policy with that Id exists");
        }
    }).catch((err) => {
      new Error(HttpStatus.OK, err.message).writeResponse(res);
   });
 }
}

exports.findPolicy = findPolicy;
exports.findPolicies = findPolicies;
exports.savePolicy = savePolicy;
exports.updatePolicy = updatePolicy;
