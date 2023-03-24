import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { TokenAuthGuard } from "./auth/jwt-auth.guard";
import { RefreshTokenAuthGuard } from "./auth/jwt-refresh-auth.guard";
import { RefreshTokenStrategy } from "./auth/jwt-refresh.strategy";
import { AccessTokenStrategy } from "./auth/jwt.strategy";
import { AuthController } from "./controllers/auth/auth.controller";
import { User, UserSchema } from "./controllers/auth/schemas/user.schema";
import { AuthService } from "./controllers/auth/services/auth.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://machiaveliogb:zxcvbnmqaqa1234@mongodb.zocosjx.mongodb.net/mach"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: TokenAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RefreshTokenAuthGuard,
    // },
  ],
})
export class AppModule {}
