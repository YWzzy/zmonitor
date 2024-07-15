import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { CustomHttpException } from "src/common/exception";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.session.token;

    if (!token) {
      throw new CustomHttpException(1005, "未登录22");
    }

    try {
      const decoded = jwt.verify(token, "secretKey");
      request.user = decoded;
      return true;
    } catch (error) {
      throw new CustomHttpException(1005, "Token无效");
    }
  }
}
