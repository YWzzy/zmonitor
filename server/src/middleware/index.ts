import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log("局部中间件");
    // 白名单配置
    // res.send("wo 被拦截了");
    next();
  }
}
