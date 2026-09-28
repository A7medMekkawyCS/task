const { Schema, model } = require('mongoose');
const StatusEnum = require('@root/helpers/enums/status.enum');

class UserSchema extends Schema {
  constructor(schemaOptions = {}) {
    const options = {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [StatusEnum.ACTIVE, StatusEnum.BLOCK, StatusEnum.DELETE],
        default: StatusEnum.ACTIVE,
      },

      ...schemaOptions,
    };

    super(options, { timestamps: true, versionKey: false });
  }
}

const userSchema = new UserSchema();

/** Same public shape as Nest: id + email + token */
class UserPublic {
  constructor(id, email, token) {
    this.id = id;
    this.email = email;
    this.token = token;
  }

  static fromDocument(user, token) {
    return new UserPublic(user._id.toString(), user.email, token);
  }
}

const UserModel = model('User', userSchema);

module.exports = {
  UserSchema,
  userSchema,
  UserModel,
  UserPublic,
};
