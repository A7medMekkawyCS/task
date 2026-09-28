const AuthService = require('../services/auth.service');
const i18n = require('../utils/i18n');

class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.profile = this.profile.bind(this);
  }

  async signup(req, res, next) {
    try {
      const lang = i18n.resolveLang(req);
      const { email, password } = req.body;
      const apiResponse = await this.authService.signup(email, password, lang);
      return res.status(Number(apiResponse.status)).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const lang = i18n.resolveLang(req);
      const { email, password } = req.body;
      const apiResponse = await this.authService.login(email, password, lang);
      return res.status(Number(apiResponse.status)).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  }

  profile(req, res, next) {
    try {
      const lang = i18n.resolveLang(req);
      const apiResponse = this.authService.profile(req.user, lang);
      return res.status(Number(apiResponse.status)).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthController;
