import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserDocument> {
    return this.userModel
      .findOne({ email })
      .select(withPassword ? '+password' : '')
      .exec();
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }
}
