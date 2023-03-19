import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByUsername(username: string) {
    const response = await this.userModel.find({ username: username });

    return response;
  }

  createUser() {
    this.userModel.create({ username: "a", password: "1234" });
  }
}
