const passport = require('passport');
const ApiResponse = require('../utils/api-response');
const i18n = require('../utils/i18n');

class JwtAuthMiddleware {
  handle(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const lang = i18n.resolveLang(req);
      return res
        .status(401)
        .json(ApiResponse.error(401, i18n.t('common.tokenRequired', lang)));
    }

    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const lang = i18n.resolveLang(req);
        return res
          .status(401)
          .json(ApiResponse.error(401, i18n.t('common.tokenInvalid', lang)));
      }

      req.user = user;
      return next();
    })(req, res, next);
  }
}

module.exports = JwtAuthMiddleware;
