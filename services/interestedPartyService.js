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

  findInterestedParties(search, pageDescriptor){
    return model.findInterestedParties(search, pageDescriptor.page, pageDescriptor.size, 'asc');
  }
}

module.exports = InterestedPartyService;
