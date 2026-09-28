const { UserModel } = require('../models/user.model');
const StatusEnum = require('@root/helpers/enums/status.enum');

class UserRepository {
  findByEmail(email) {
    return UserModel.findOne({
      email,
      status: { $ne: StatusEnum.DELETE },
    });
  }

  create(email, hashedPassword) {
    return UserModel.create({
      email,
      password: hashedPassword,
      status: StatusEnum.ACTIVE,
    });
  }
}

module.exports = UserRepository;
