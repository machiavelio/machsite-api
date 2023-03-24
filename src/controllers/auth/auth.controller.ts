import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { Query, UseGuards } from "@nestjs/common/decorators";
import { CreateUserModel } from "./models/create-user.model";
import { AuthService } from "./services/auth.service";
import { Request } from "express";
import { TokenAuthGuard } from "src/auth/jwt-auth.guard";
import { RefreshTokenAuthGuard } from "src/auth/jwt-refresh-auth.guard";
import { UserAuth } from "src/auth/user-auth.model";
import { User } from "src/decorators/user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("check")
  async check(@Query() { username }: { username: string }) {
    const response = await this.authService.existsUserWithUsername(username);

    return response;
  }

  @Post("connect")
  async login(@Body() user: CreateUserModel) {
    const foundUser = await this.authService.verifyUser(user);

    if (!foundUser) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    const tokens = this.authService.generateTokens(foundUser);

    this.authService.storeRefreshToken(foundUser.id, tokens.refresh_token);

    return tokens;
  }

  @Post("create")
  async register(@Body() user: CreateUserModel) {
    const createdUser = await this.authService.createUser(user);

    return createdUser;
  }

  @UseGuards(TokenAuthGuard)
  @Get("logout")
  async logout(@User() userAuth: UserAuth) {
    await this.authService.storeRefreshToken(userAuth.userId, null);
  }

  @UseGuards(TokenAuthGuard)
  @Get("test")
  async test(@User() userAuth: UserAuth) {
    return true;
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get("refresh")
  async refresh(@User() userAuth: UserAuth) {
    const verified = this.authService.verifyUserRefreshToken(userAuth.userId, userAuth.refreshToken);

    if (!verified) {
      throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }

    const user = await this.authService.getUserById(userAuth.userId);

    const tokens = this.authService.generateTokens(user);

    await this.authService.storeRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }
}
