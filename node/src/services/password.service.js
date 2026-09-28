const bcrypt = require('bcrypt');

class PasswordService {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  hash(plainPassword) {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  compare(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = PasswordService;
