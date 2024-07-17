import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { CustomHttpException } from "src/common/exception";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.session.token;

    console.log("====================================");
    console.log(token);
    console.log("====================================");

    if (!token) {
      throw new CustomHttpException(1005, "未登录");
    }

    try {
      const secretKey = this.configService.get<string>("SECRET_KEY");
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
