'use strict';
const model = require('model').model;

class InterestedPartyService {
  constructor(){
  }

  saveInterestedParty(party){
    return model.saveInterestedParty(party);
  }

  updateInterestedParty(party){
    return model.updateInterestedParty(party);
  }

  findInterestedParty(id){
    return model.findInterestedParty(id);
  }

}

exports.InterestedPartyService = InterestedPartyService
