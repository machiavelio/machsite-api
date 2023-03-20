import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserModel } from "../models/create-user.model";
import { ConnectUserModel } from "../models/connect-user.model";
import { User, UserDocument } from "../schemas/user.schema";
import { UserModel } from "../models/user.model";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async existsUserWithUsername(username: string) {
    const user = await this.userModel.findOne({ username: username });

    return !!user;
  }

  async getUser(user: ConnectUserModel) {
    const foundUser = await this.userModel.findOne({ username: user.username });

    if (foundUser.password === user.password) {
      return {
        id: foundUser.id,
        username: foundUser.username,
      } as UserModel;
    }

    return null;
  }

  async createUser(user: CreateUserModel) {
    const createdUser = await this.userModel.create({ username: user.username, password: user.password });

    return {
      id: createdUser.id,
      username: createdUser.username,
    } as UserModel;
  }
}
