class AppError extends Error {
  /**
   * @param {string} messageKey i18n key, e.g. auth.emailExists
   * @param {number} statusCode HTTP status
   * @param {string} [statusName] ApiResponse key: fail | exception
   */
  constructor(messageKey, statusCode = 500, statusName = 'fail') {
    super(messageKey);
    this.messageKey = messageKey;
    this.statusCode = statusCode;
    this.statusName = statusName;
    this.name = 'AppError';
  }
}

module.exports = AppError;
