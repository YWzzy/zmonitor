import { Module, Global, DynamicModule } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from "@nestjs/config";
import * as path from "path";

interface Options {
  path: string;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: Options): DynamicModule {
    console.log("====================================");
    console.log(
      "ConfigModule.forRoot",
      path.resolve(process.cwd(), "src/config/", options.path)
    );
    console.log("====================================");
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: path.resolve(process.cwd(), "src/config/", options.path),
        }),
      ],
      exports: [NestConfigModule],
    };
  }
}
