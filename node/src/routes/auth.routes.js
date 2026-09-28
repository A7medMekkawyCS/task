const express = require('express');
const AuthController = require('../controllers/auth.controller');
const JwtAuthMiddleware = require('../middlewares/jwt-auth.middleware');
const AuthValidation = require('../utils/validation/auth.validation');

class AuthRoutes {
  constructor(
    authController = new AuthController(),
    jwtAuthMiddleware = new JwtAuthMiddleware(),
  ) {
    this.router = express.Router();
    this.authController = authController;
    this.jwtAuthMiddleware = jwtAuthMiddleware;
    this.register();
  }

  register() {
    this.router.post(
      '/signup',
      AuthValidation.signup(),
      this.authController.signup,
    );

    this.router.post(
      '/login',
      AuthValidation.login(),
      this.authController.login,
    );

    this.router.get(
      '/profile',
      this.jwtAuthMiddleware.handle.bind(this.jwtAuthMiddleware),
      this.authController.profile,
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AuthRoutes;
