import { Module, Global, DynamicModule } from "@nestjs/common";

interface Options {
  path: string;
}

@Global()
@Module({
  //   providers: [
  //     {
  //       provide: 'Config',
  //       useValue: { baseUrl: '/dev' },
  //     },
  //   ],
  //   exports: [
  //     {
  //       provide: 'Config',
  //       useValue: { baseUrl: '/dev'},
  //     },
  //   ],
})
export class ConfigModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: "Config",
          useValue: { baseUrl: "/dev/" + options.path },
        },
      ],
      exports: [
        {
          provide: "Config",
          useValue: { baseUrl: "/dev/" + options.path },
        },
      ],
    };
  }
}
