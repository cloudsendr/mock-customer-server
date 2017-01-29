'use strict';

const controller = require('../controllers/policy.controller.js');

module.exports = (app) => {
  app.get('/api/v1/policies', controller.findPolicies(app));
  app.get('/api/v1/policies/:id', controller.findPolicy(app));
  app.post('/api/v1/policies', controller.savePolicy(app));
  app.put('/api/v1/policies', controller.updatePolicy(app));
}
