const ApiResponse = require('../utils/api-response');
const i18n = require('../utils/i18n');

/** Same as Nest SecretKeyGuard: require header secret_key on every request. */
class SecretKeyMiddleware {
  handle(req, res, next) {
    const incomingKey = req.headers['secret_key'];
    const expectedKey = process.env.SECRET_KEY;

    if (!expectedKey || incomingKey !== expectedKey) {
      const lang = i18n.resolveLang(req);
      return res
        .status(401)
        .json(
          ApiResponse.error(401, i18n.t('common.invalidSecretKey', lang)),
        );
    }

    return next();
  }
}

module.exports = SecretKeyMiddleware;
