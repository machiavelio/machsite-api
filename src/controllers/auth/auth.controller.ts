import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async login() {
    return await this.authService.findByUsername("a");
    return true;
  }

  @Get("create")
  register() {
    this.authService.createUser();
    return true;
  }
}
