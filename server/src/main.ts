/*
 * @Author: yinhan 1738348915@qq.com
 * @Date: 2024-05-17 15:41:42
 * @LastEditors: yinhan 1738348915@qq.com
 * @LastEditTime: 2024-05-21 14:50:34
 * @FilePath: \zjiang-web-monitor\server\src\main.ts
 * @Description:
 */
import { NestFactory } from "@nestjs/core";
import { VersioningType, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cors from "cors";
import { Request, Response, NextFunction } from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ResponseInter } from "./common/response";
import { HttpFilter } from "./common/filter";
import { RoleGuard } from "./guard/role.guard";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

var bodyParser = require("body-parser");

const whiteList = ["/list", "/user"];

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  console.log("全局中间件", req.originalUrl);
  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    res.send({ msg: "非白名单权限" });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("nest测试")
    .setDescription("项目的描述")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/api-docs", app, document);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    session({
      secret: "zzzyyykey",
      rolling: true,
      name: "zzy.sid",
      cookie: { maxAge: 999999 },
    })
  );
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  app.use(cors());
  // app.use(MiddlewareAll);
  app.useGlobalInterceptors(new ResponseInter());
  // app.useGlobalFilters(new HttpFilter());
  app.useStaticAssets(join(__dirname, "images"));
  // 全局路由
  // app.useGlobalGuards(new RoleGuard());

  await app.listen(8083);
}
bootstrap();
