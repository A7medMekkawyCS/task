const express = require('express');
const HealthController = require('../controllers/health.controller');

class HealthRoutes {
  constructor(healthController = new HealthController()) {
    this.router = express.Router();
    this.healthController = healthController;
    this.register();
  }

  register() {
    this.router.get('/', this.healthController.check);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = HealthRoutes;
