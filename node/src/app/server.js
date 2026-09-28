const express = require('express');
const passport = require('passport');
const Database = require('../config/database');
const PassportConfig = require('../config/passport.config');
const AuthRoutes = require('../routes/auth.routes');
const HealthRoutes = require('../routes/health.routes');
const ErrorHandler = require('../utils/error-handler');
const SecretKeyMiddleware = require('../middlewares/secret-key.middleware');

class App {
  constructor() {
    this.app = express();
    this.database = new Database();
    this.errorHandler = new ErrorHandler();
    this.secretKeyMiddleware = new SecretKeyMiddleware();
  }

  async init() {
    await this.database.connect();
    PassportConfig.configure();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
    return this;
  }

  setupMiddlewares() {
    // JSON + form-urlencoded + multipart form-data (Postman form-data)
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(require('multer')().none());
    this.app.use(this.secretKeyMiddleware.handle.bind(this.secretKeyMiddleware));
    this.app.use(passport.initialize());
  }

  setupRoutes() {
    const authRoutes = new AuthRoutes();
    const healthRoutes = new HealthRoutes();

    this.app.use('/auth', authRoutes.getRouter());
    this.app.use('/health', healthRoutes.getRouter());
  }

  setupErrorHandler() {
    this.app.use(this.errorHandler.handle.bind(this.errorHandler));
  }

  listen() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

module.exports = App;
