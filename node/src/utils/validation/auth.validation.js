const { body, validationResult } = require('express-validator');
const ApiResponse = require('../api-response');
const i18n = require('../i18n');

class AuthValidation {
  static signup() {
    return [
      body('email')
        .exists({ checkFalsy: true })
        .withMessage('validation.emailRequired')
        .bail()
        .isEmail()
        .withMessage('validation.emailInvalid')
        .normalizeEmail(),
      body('password')
        .exists({ checkFalsy: true })
        .withMessage('validation.passwordRequired')
        .bail()
        .isString()
        .withMessage('validation.passwordString')
        .bail()
        .isLength({ min: 6 })
        .withMessage('validation.passwordMin'),
      AuthValidation.run,
    ];
  }

  static login() {
    return [
      body('email')
        .exists({ checkFalsy: true })
        .withMessage('validation.emailRequired')
        .bail()
        .isEmail()
        .withMessage('validation.emailInvalid')
        .normalizeEmail(),
      body('password')
        .exists({ checkFalsy: true })
        .withMessage('validation.passwordRequired')
        .bail()
        .isString()
        .withMessage('validation.passwordString')
        .bail()
        .isLength({ min: 6 })
        .withMessage('validation.passwordMin'),
      AuthValidation.run,
    ];
  }

  static run(req, res, next) {
    const lang = i18n.resolveLang(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // First error only — same idea as Nest stopAtFirstError
      const first = errors.array({ onlyFirstError: true })[0];
      const message = i18n.t(first.msg, lang);

      return res.status(400).json(ApiResponse.error(400, message));
    }

    return next();
  }
}

module.exports = AuthValidation;
