import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { CustomHttpException } from "src/common/exception";
import * as dotenv from "dotenv";
import * as path from "path";

const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../src/config/production.env")
    : path.resolve(__dirname, "../src/config/development.env");
dotenv.config({ path: envFilePath });
@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.session.token;

    if (!token) {
      throw new CustomHttpException(1005, "未登录");
    }

    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey);
      request.user = decoded;
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new CustomHttpException(1005, "Token已过期");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomHttpException(1005, "Token无效");
      } else {
        throw new CustomHttpException(1005, "Token验证失败");
      }
    }
  }
}
