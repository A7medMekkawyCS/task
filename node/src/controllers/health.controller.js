const ApiResponse = require('../utils/api-response');
const i18n = require('../utils/i18n');

class HealthController {
  constructor() {
    this.check = this.check.bind(this);
  }

  check(req, res) {
    const lang = i18n.resolveLang(req);

    return res
      .status(200)
      .json(
        ApiResponse.success(200, i18n.t('auth.healthOk', lang), {
          status: 'ok',
        }),
      );
  }
}

module.exports = HealthController;
