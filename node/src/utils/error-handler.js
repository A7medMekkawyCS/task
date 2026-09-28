const AppError = require('./app-error');
const ApiResponse = require('./api-response');
const i18n = require('./i18n');

class ErrorHandler {
  handle(err, req, res, next) {
    const lang = i18n.resolveLang(req);
    const statusCode = err.statusCode || 500;

    const messageKey =
      err.messageKey ||
      (statusCode >= 500 ? 'common.exception' : err.message) ||
      'common.exception';

    const message = i18n.t(messageKey, lang);

    return res.status(statusCode).json(ApiResponse.error(statusCode, message));
  }

  static notFound(messageKey = 'common.exception') {
    return new AppError(messageKey, 404);
  }
}

module.exports = ErrorHandler;
