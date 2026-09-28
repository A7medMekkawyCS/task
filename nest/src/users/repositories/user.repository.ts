import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

/**
 * Repository pattern: all User MongoDB access lives here.
 * Services talk to the repository, not directly to the Model.
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  create(email: string, hashedPassword: string): Promise<UserDocument> {
    return this.userModel.create({
      email,
      password: hashedPassword,
    });
  }
}
