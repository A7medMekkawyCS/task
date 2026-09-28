const jwt = require('jsonwebtoken');

class TokenService {
  constructor(secret = process.env.JWT_SECRET, expiresIn = '15m') {
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  createToken(userId, email) {
    return jwt.sign(
      {
        sub: userId,
        email,
      },
      this.secret,
      { expiresIn: this.expiresIn },
    );
  }
}

module.exports = TokenService;
