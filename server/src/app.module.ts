import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerMiddleware } from "./logger.middleware";
import { MulterModule } from "@nestjs/platform-express";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
// import { ConfigModule } from "./config/config.module";
import { UploadModule } from "./upload/upload.module";
import { SpiderModule } from "./spider/spider.module";
import { GuardModule } from "./guard/guard.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TestModule } from "./test/test.module";
import { PachongModule } from "./pachong/pachong.module";
import { MonitorModule } from "./monitor/monitor.module";
import { PerformanceModule } from "./performance/performance.module";
import { WhiteScreenModule } from "./white-screen/white-screen.module";
import { ErrorMonitorModule } from "./error-monitor/error-monitor.module";
import { FileUploadModule } from "./file-upload/file-upload.module";
import { RecordingModule } from "./recording/recording.module";
import { FileUploadService } from "./file-upload/file-upload.service";
import { Recording } from "./recording/entities/recording.entity";
import { ApplicationModule } from "./application/application.module";
import { AnalyseModule } from "./analyse/analyse.module";
import { ReportPerformanceEsModule } from "./report-performance-es/report-performance-es.module";
import { ConfigurationService } from "./config/config.service"; // 导入 ConfigurationService
import { DistUploadModule } from './dist-upload/dist-upload.module';
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../production.env")
    : path.resolve(__dirname, "../src/config/development.env");
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  console.error("production.env file not found:", envFilePath);
  process.exit(1);
}

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   path: "zzzyyy",
    // }), // 加载配置模块，并设置配置文件路径为 "zzzyyy"

    // ConfigModule.forRoot({
    //   path:
    //     process.env.NODE_ENV === "development"
    //       ? "development.env"
    //       : "production.env",
    // }),
    ConfigModule.forRoot({
      ignoreEnvFile: true, // 忽略默认的 .env 文件
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "mysql",
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
        retryDelay: 500,
        retryAttempts: 10,
        autoLoadEntities: true,
      }),
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: "mysql",
    //     host: configService.get<string>("DB_HOST"),
    //     port: configService.get<number>("DB_PORT"),
    //     username: configService.get<string>("DB_USERNAME"),
    //     password: configService.get<string>("DB_PASSWORD"),
    //     database: configService.get<string>("DB_DATABASE"),
    //     entities: [__dirname + "/**/*.entity{.ts,.js}"],
    //     synchronize: true,
    //     retryDelay: 500,
    //     retryAttempts: 10,
    //     autoLoadEntities: true,
    //   }),
    //   inject: [ConfigService],
    // }),
    MulterModule.registerAsync({
      imports: [FileUploadModule],
      useFactory: (fileUploadService: FileUploadService) =>
        fileUploadService.multerOptions(),
      inject: [FileUploadService],
    }),
    UserModule,
    UploadModule,
    SpiderModule,
    GuardModule,
    // TypeOrmModule.forRoot({
    //   type: "mysql", //数据库类型
    //   username: "root", //账号
    //   // password: "zzy0401", //密码
    //   password: "123456", //密码
    //   host: "localhost", //host
    //   port: 3306, //
    //   database: "monitor", //库名
    //   entities: [__dirname + "/**/*.entity{.ts,.js}"], //实体文件
    //   synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库  生产环境不建议使用
    //   retryDelay: 500, //重试连接数据库间隔
    //   retryAttempts: 10, //重试连接数据库的次数
    //   autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    // }),
    TypeOrmModule.forFeature([Recording]), // 将Recording实体类传递给模块
    TestModule,
    PachongModule,
    MonitorModule,
    PerformanceModule,
    WhiteScreenModule,
    ErrorMonitorModule,
    FileUploadModule,
    RecordingModule,
    ApplicationModule,
    AnalyseModule,
    ReportPerformanceEsModule,
    DistUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
