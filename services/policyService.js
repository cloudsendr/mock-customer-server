'use strict';
const model = require('model').model;

class PolicyService {
   constructor(){
   }

   savePolicy(policy){
     return model.savePolicy(policy);
   }

   updatePolicy(policy){
     return model.updatePolicy(policy);
   }

   findPolicyById(id){
     return model.findPolicy(id);
   }

   findPolicies(search, pageDescriptor){
     return model.findPolicies(search, pageDescriptor.page, pageDescriptor.size, 'asc');
   }
}

module.exports = PolicyService;
