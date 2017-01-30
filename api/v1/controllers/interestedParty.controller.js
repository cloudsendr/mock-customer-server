'use strict';
const debug = require('debug')('interestedParty-controller');
const appRoot = require('app-root-path');

const HttpStatus = require('http-status');
const interestedPartyModel = require('model').model;
const ServiceError = require('core-server').ServiceError;
const interestedParty = interestedPartyModel.InterestedParty;
const InterestedPartyService = require(appRoot + '/services/interestedPartyService');

/**
 * Build Page Descriptor
 */
const buildPageDescriptor = (query) => {
  return {
    page: query.page || 0,
    size: query.size || 10
  }
}

const findInterestedParties = (app) => {
  return (req, res) => {
    let url = require('url');
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let search = query.search;
    let pageDescriptor = buildPageDescriptor(query);
    let interestedPartyService = new InterestedPartyService();

    interestedPartyService.findInterestedParties(search, pageDescriptor).then((page) => {
      res.status(HttpStatus.OK).send(page);
    }).catch((err) => {
      new ServiceError(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
    });
  }
}

const findInterestedParty = (app) => {
  return (req, res) => {
    let id = req.params.id;
    // validate id requirements.  If invalid return BAD_REQUEST
    let interestedPartyService = new InterestedPartyService();
    interestedPartyService.findInterestedParty(id).then((result) => {
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

const saveInterestedParty = (app) => {
  return (req, res) => {
    let interestedParty = req.body;
    let interestedPartyService = new InterestedPartyService();

    interestedPartyService.saveInterestedParty(interestedParty).then((result) => {
       console.log(result);
       res.status(HttpStatus.OK).send(result);
     }).catch((err) => {
        new Error(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
    });
 }
}

const updateInterestedParty = (app) => {
  return (req, res) => {
    let interestedParty = req.body;
    let interestedPartyService = new InterestedPartyService();
    let ipId = interestedParty.id;

    interestedPartyService.findInterestedParty(ipId).then((result) => {
        if (result ){
          interestedPartyService.updateInterestedParty(interestedParty).then((doc) => {
            console.log(doc);
             res.status(HttpStatus.OK).send(doc);
           }).catch((err) => {
              new Error(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
          });
        } else {
          new Error(HttpStatus.BAD_REQUEST, "No Party with that Id exists").writeResponse(res);
        }
    }).catch((err) => {
      new Error(HttpStatus.INTERNAL_SERVER_ERROR, err.message).writeResponse(res);
   });
   }

}

exports.findInterestedParty = findInterestedParty;
exports.findInterestedParties = findInterestedParties;
exports.saveInterestedParty = saveInterestedParty;
exports.updateInterestedParty = updateInterestedParty;
