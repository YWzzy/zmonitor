import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Delete,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import * as dayjs from "dayjs";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as svgCaptcha from "svg-captcha";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from "@nestjs/swagger";
import { Response, Request } from "express";

@Controller("user")
@ApiTags("用户权限")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("code")
  @ApiOperation({
    summary: "获取验证码",
    description: "获取登录时需要输入的验证码",
  })
  createCode(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: "#ebfff0",
    });
    req.session.code = captcha.text.toLowerCase(); // 存储验证码记录到 session
    res.type("image/svg+xml");
    res.send(captcha.data);
  }

  @Post("login")
  @ApiOperation({
    summary: "用户登录",
    description: "用户登录接口，验证验证码并生成 Token",
  })
  @ApiBody({
    type: CreateUserDto,
    description: "登录信息，包括账号、密码和验证码",
  })
  async login(@Req() req, @Res() res: Response, @Body() body: CreateUserDto) {
    try {
      const { account, password, code } = body;
      // if (!req.session.code || req.session.code !== code.toLowerCase()) {
      //   return { code: 1003, message: "验证码错误" };
      // }

      const user = await this.userService.findUserByAccount(account);
      if (!user) {
        res.status(500).json({ code: 500, message: "用户不存在" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(500).json({ code: 500, message: "密码错误" });
      }

      const token = jwt.sign({ userId: user.id }, "secretKey", {
        expiresIn: "1d",
      });
      req.session.token = token;
      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error.message,
      });
    }
  }

  @Post("register")
  @ApiOperation({
    summary: "用户注册",
    description: "用户注册接口，创建新用户",
  })
  @ApiBody({ type: CreateUserDto, description: "注册信息，包括账号和密码" })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const { account, password } = createUserDto;
      const existingUser = await this.userService.findUserByAccount(account);
      if (existingUser) {
        return { code: 1004, message: "用户已存在" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });
      return { code: 200, message: "注册成功" };
    } catch (error) {
      return { code: 500, message: `注册失败: ${error.message}` };
    }
  }

  @Get("getUserInfo")
  @ApiOperation({
    summary: "获取用户信息",
    description: "根据 Token 获取当前登录用户信息",
  })
  async getUserInfo(@Req() req) {
    const token = req.session.token;
    if (!token) {
      return { code: 1005, message: "未登录" };
    }

    try {
      const decoded = jwt.verify(token, "secretKey");
      const user = await this.userService.findUserById(decoded.userId);
      if (!user) {
        return { code: 1006, message: "用户不存在" };
      }
      return { code: 200, data: user };
    } catch (error) {
      return { code: 1005, message: "Token无效" };
    }
  }

  @Post("loginOut")
  @ApiOperation({
    summary: "用户登出",
    description: "用户登出接口，清除登录状态",
  })
  async loginOut(@Req() req) {
    req.session.token = null;
    return { code: 200, message: "登出成功" };
  }
}
