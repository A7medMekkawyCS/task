const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

class PassportConfig {
  static configure() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    };

      passport.use(
      new JwtStrategy(options, (payload, done) => {
        // Same public shape as Nest AuthUser (id + email).
        return done(null, {
          id: payload.sub,
          email: payload.email,
        });
      }),
    );
  }
}

module.exports = PassportConfig;
