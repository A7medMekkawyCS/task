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
      throw new AppError('auth.invalidCredentials', StatusCodes.BAD_REQUEST);
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
            : StatusCodes.BAD_REQUEST;
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

  /** Same response data shape as signup/login: id + email + token. */
  profile(authUser, lang) {
    const token = this.tokenService.createToken(authUser.id, authUser.email);

    return ApiResponse.success(
      StatusCodes.OK,
      i18n.t('auth.profile', lang),
      new UserPublic(authUser.id, authUser.email, token),
    );
  }
}

module.exports = AuthService;
