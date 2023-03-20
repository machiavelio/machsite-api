import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { Query } from "@nestjs/common/decorators";
import { CreateUserModel } from "./models/create-user.model";
import { AuthService } from "./services/auth.service";

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
    const foundUser = await this.authService.getUser(user);

    if (!foundUser) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    return foundUser;
  }

  @Post("create")
  async register(@Body() user: CreateUserModel) {
    const createdUser = await this.authService.createUser(user);

    return createdUser;
  }
}
