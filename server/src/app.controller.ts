import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserService } from "./user/user.service";

@Controller("get")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Get("getZzy")
  getHello(): any {
    // return this.appService.getHello();
    let query = {
      keyWord: "string",
      page: 1,
      pageSize: 10,
    };
    return this.userService.findAll(query);
  }
}
