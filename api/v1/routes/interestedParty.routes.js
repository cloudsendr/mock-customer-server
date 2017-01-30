'use strict';

const controller = require('../controllers/interestedParty.controller.js');

module.exports = (app) => {
  app.get('/api/v1/interestedParties', controller.findInterestedParties(app));
  app.get('/api/v1/interestedParties/:id', controller.findInterestedParty(app));
  app.post('/api/v1/interestedParties', controller.saveInterestedParty(app));
  app.put('/api/v1/interestedParties', controller.updateInterestedParty(app));
}
