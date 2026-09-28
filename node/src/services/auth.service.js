const AppError = require('../utils/app-error');
const ApiResponse = require('../utils/api-response');
const StatusCodes = require('../utils/status-codes');
const i18n = require('../utils/i18n');
const StatusEnum = require('@root/helpers/enums/status.enum');
const { UserPublic } = require('../models/user.model');
const UserRepository = require('../repositories/user.repository');
const PasswordService = require('./password.service');
const TokenService = require('./token.service');

class AuthService {
  constructor(
    userRepository = new UserRepository(),
    passwordService = new PasswordService(),
    tokenService = new TokenService(),
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
  }

  async signup(email, password, lang) {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new AppError('auth.emailExists', StatusCodes.CONFLICT);
    }

    const hashedPassword = await this.passwordService.hash(password);
    const user = await this.userRepository.create(email, hashedPassword);

    const token = this.tokenService.createToken(
      user._id.toString(),
      user.email,
    );

    return ApiResponse.success(
      StatusCodes.CREATED,
      i18n.t('auth.signupSuccess', lang),
      UserPublic.fromDocument(user, token),
    );
  }

  async login(email, password, lang) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('auth.invalidCredentials', StatusCodes.UNAUTHORIZED);
    }

    const errorChecks = {
      invalidCredentials: !(await this.passwordService.compare(
        password,
        user.password,
      )),
      accountStop: user.status === StatusEnum.BLOCK,
    };

    for (const [errorKey, condition] of Object.entries(errorChecks)) {
      if (condition) {
        const status =
          errorKey === 'accountStop'
            ? StatusCodes.FORBIDDEN
            : StatusCodes.UNAUTHORIZED;
        throw new AppError(`auth.${errorKey}`, status);
      }
    }

    const token = this.tokenService.createToken(
      user._id.toString(),
      user.email,
    );

    return ApiResponse.success(
      StatusCodes.OK,
      i18n.t('auth.loginSuccess', lang),
      UserPublic.fromDocument(user, token),
    );
  }

  /** Match Nest profile: userId + email (from token, no DB). */
  profile(authUser, lang) {
    return ApiResponse.success(
      StatusCodes.OK,
      i18n.t('auth.profile', lang),
      {
        userId: authUser.userId,
        email: authUser.email,
      },
    );
  }
}

module.exports = AuthService;
