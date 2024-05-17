import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  Version,
  Res,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as svgCaptcha from "svg-captcha";
import { UserPipe } from "./user.pipe";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

// @Controller({
//   path: 'user',
//   version: '1',
// })
@Controller("user")
@ApiTags("用户权限")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("code")
  createCode(@Req() req, @Res() res) {
    const Captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: "#ebfff0", //背景颜色
    });
    req.session.code = Captcha.text; //存储验证码记录到session
    res.type("image/svg+xml");
    res.send(Captcha.data);
  }

  @Post("login")
  createUser(@Req() req, @Body() Body) {
    if (
      req.session.code?.toLocaleLowerCase() !== Body?.code?.toLocaleLowerCase()
    ) {
      return {
        code: 500,
        msg: "验证码错误",
      };
    }
    return {
      code: 200,
    };
  }

  // @Post()
  // create(@Request() req) {
  //   console.log(req.body);

  //   return {
  //     code: 200,
  //   };
  // }

  @Post("create")
  @ApiOperation({ summary: "创建用户接口", description: "描述xxx" })
  @ApiQuery({ name: "createUserDto", description: "createUserDto信息" })
  create(@Body(UserPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post()
  @ApiOperation({ summary: "获取所有用户列表", description: "描述xxx" })
  @ApiQuery({ name: "query", description: "查询信息" })
  // @Version("2")
  findAll(
    @Body() query: { keyWord: string; page: number; pageSize: number }
  ): any {
    return this.userService.findAll(query);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新用户信息", description: "描述xxx" })
  @ApiQuery({ name: "id", description: "用户id" })
  @ApiQuery({ name: "updateUserDto", description: "更新信息" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "根据id删除用户", description: "描述xxx" })
  @ApiQuery({ name: "id", description: "删除用户的id" })
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }

  // @Get(":id")
  // findOne(@Param("id", ParseIntPipe) id: number) {
  //   console.log("====>", typeof id);
  //   return this.userService.findOne(+id);
  // }
}
