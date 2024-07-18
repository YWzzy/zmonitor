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
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as svgCaptcha from "svg-captcha";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { CustomHttpException } from "src/common/exception";
import { Auth } from "src/decorator/Auth";
import * as dotenv from "dotenv";
import * as path from "path";

const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../src/config/production.env")
    : path.resolve(__dirname, "../src/config/development.env");
dotenv.config({ path: envFilePath });

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
  async login(@Req() req, @Body() body: CreateUserDto) {
    const { account, password, code } = body;

    // if (!req.session.code || req.session.code !== code.toLowerCase()) {
    //   throw new CustomHttpException(1003, "验证码错误");
    // }

    const user = await this.userService.findUserByAccount(account);
    if (!user) {
      throw new CustomHttpException(1006, "用户不存在");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomHttpException(1003, "密码错误");
    }

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "7d",
    });
    req.session.token = token;
    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 确保 session cookie 也有 7 天的过期时间
    return { message: "登录成功", token };
  }

  @Post("register")
  @ApiOperation({
    summary: "用户注册",
    description: "用户注册接口，创建新用户",
  })
  @Auth() // 暂关闭注册功能
  @ApiBody({ type: CreateUserDto, description: "注册信息，包括账号和密码" })
  async register(@Body() createUserDto: CreateUserDto) {
    const { account, password } = createUserDto;
    const existingUser = await this.userService.findUserByAccount(account);
    if (existingUser) {
      throw new CustomHttpException(1004, "用户已存在");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return { code: 200, message: "注册成功" };
  }

  @Get("getUserInfo")
  @ApiOperation({
    summary: "获取用户信息",
    description: "根据 Token 获取当前登录用户信息",
  })
  @Auth()
  async getUserInfo(@Req() req) {
    const token = req.session.token;
    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey);
      const user = await this.userService.findUserById(decoded.userId);
      if (!user) {
        throw new CustomHttpException(1006, "用户不存在");
      }
      return user;
    } catch (error) {
      throw new CustomHttpException(1005, "Token无效");
    }
  }

  @Post("loginOut")
  @ApiOperation({
    summary: "用户登出",
    description: "用户登出接口，清除登录状态",
  })
  @Auth()
  async loginOut(@Req() req) {
    req.session.token = null;
    return { code: 200, message: "登出成功" };
  }
}
