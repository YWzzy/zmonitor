/*
 * @Author: yinhan 1738348915@qq.com
 * @Date: 2024-05-17 15:41:42
 * @LastEditors: yinhan 1738348915@qq.com
 * @LastEditTime: 2024-05-21 14:54:47
 * @FilePath: \zjiang-web-monitor\server\src\app.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "./config/config.module";
import { ListModule } from "./list/list.module";
import { UploadModule } from "./upload/upload.module";
import { SpiderModule } from "./spider/spider.module";
import { GuardModule } from "./guard/guard.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TestModule } from "./test/test.module";
import { PachongModule } from "./pachong/pachong.module";
import { MonitorModule } from "./monitor/monitor.module";

@Module({
  imports: [
    UserModule,
    ListModule,
    ConfigModule.forRoot({
      path: "zzzyyy",
    }),
    UploadModule,
    SpiderModule,
    GuardModule,
    TypeOrmModule.forRoot({
      type: "mysql", //数据库类型
      username: "root", //账号
      // password: "zzy0401", //密码
      password: "123456", //密码
      host: "localhost", //host
      port: 3306, //
      database: "monitor", //库名
      entities: [__dirname + "/**/*.entity{.ts,.js}"], //实体文件
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库  生产环境不建议使用
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    }),
    TestModule,
    PachongModule,
    MonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
