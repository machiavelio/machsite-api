import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./controllers/auth/auth.controller";
import { User, UserSchema } from "./controllers/auth/schemas/user.schema";
import { AuthService } from "./controllers/auth/services/auth.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://machiaveliogb:zxcvbnmqaqa1234@mongodb.zocosjx.mongodb.net/mach"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
