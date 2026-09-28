import { UserDocument } from '../schemas/user.schema';

/**
 * Safe public representation of a User.
 * Never includes password — even hashed.
 * Same shape for signup and login: id + email + token.
 */
export class UserPublic {
  readonly id: string;
  readonly email: string;
  readonly token: string;

  constructor(id: string, email: string, token: string) {
    this.id = id;
    this.email = email;
    this.token = token;
  }

  static fromDocument(user: UserDocument, token: string): UserPublic {
    return new UserPublic(user._id.toString(), user.email, token);
  }
}
