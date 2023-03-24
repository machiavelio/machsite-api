import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserModel } from "../models/create-user.model";
import { ConnectUserModel } from "../models/connect-user.model";
import { User, UserDocument } from "../schemas/user.schema";
import { UserModel } from "../models/user.model";
import { JwtService } from "@nestjs/jwt";
import { hash, genSalt, compare } from "bcrypt";
import { jwtConstants } from "src/constants/jwt.constants";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async existsUserWithUsername(username: string) {
    const user = await this.userModel.findOne({ username: username });

    return !!user;
  }

  async verifyUser(userModel: ConnectUserModel) {
    const user = await this.userModel.findOne({ username: userModel.username });

    if (user.password === userModel.password) {
      return {
        id: user.id,
        username: user.username,
      } as UserModel;
    }

    return null;
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId);

    return {
      id: user.id,
      username: user.username,
    } as UserModel;
  }

  async verifyUserRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId);

    return await compare(refreshToken, user.refreshToken);
  }

  async createUser(userModel: CreateUserModel) {
    const user = await this.userModel.create({ username: userModel.username, password: userModel.password });

    return {
      id: user.id,
      username: user.username,
    } as UserModel;
  }

  async storeRefreshToken(userId: string, token: string) {
    const hashedRefreshToken = token && (await hash(token, await genSalt()));

    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedRefreshToken }, { new: true });
  }

  generateTokens(user: UserModel) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.tokenSecret,
        expiresIn: jwtConstants.tokenExpiresIn,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: jwtConstants.refreshTokenSecret,
        expiresIn: jwtConstants.refreshTokenExpiresIn,
      }),
    };
  }
}
