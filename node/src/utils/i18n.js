class I18n {
  constructor() {
    this.fallback = 'en';
    this.messages = {
      en: require('../i18n/en.json'),
      ar: require('../i18n/ar.json'),
    };
  }

  resolveLang(reqOrLang) {
    if (!reqOrLang) {
      return this.fallback;
    }

    if (typeof reqOrLang === 'string') {
      return this.normalize(reqOrLang);
    }

    const headers = reqOrLang.headers || {};
    const raw = headers.lang;

    return this.normalize(raw);
  }

  normalize(lang) {
    if (!lang) {
      return this.fallback;
    }

    const short = String(lang).trim().toLowerCase().slice(0, 2);
    return this.messages[short] ? short : this.fallback;
  }

  t(key, lang = this.fallback) {
    const locale = this.normalize(lang);
    const dictionary = this.messages[locale] || this.messages[this.fallback];
    return dictionary[key] || this.messages[this.fallback][key] || key;
  }
}

module.exports = new I18n();
