import { NestFactory } from "@nestjs/core";
import { VersioningType, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cors from "cors";
import { Request, Response, NextFunction } from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ResponseInterceptor } from "./common/response";
import { HttpFilter } from "./common/filter";
import { RoleGuard } from "./guard/role.guard";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CorsMiddleware } from "./middleware/cors.middleware";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";
import * as path from "path";

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

// 加载环境变量
const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "./src/config/production.env")
    : path.resolve(__dirname, "./src/config/development.env");
dotenv.config({ path: envFilePath });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("z-monitor-server")
    .setDescription("z-monitor监控后台服务")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/api-docs", app, document);

  const configService = app.get(ConfigService);
  const secretKey = configService.get<string>("SECRET_KEY");
  console.log("secretKey", secretKey);

  // 配置 session 中间件
  app.use(
    session({
      secret: secretKey, // 你自己的 secret key
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 设置 cookie 过期时间为 7 天
    })
  );

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
    credentials: true,
  });

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

  // 全局注册中间件
  // app.use(CorsMiddleware);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new HttpFilter());
  app.useStaticAssets(join(__dirname, "images"));
  // 全局路由
  // app.useGlobalGuards(new RoleGuard());

  await app.listen(9001);
}
bootstrap();
