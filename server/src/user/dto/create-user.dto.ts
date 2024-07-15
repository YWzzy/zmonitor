import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  // @IsNumber()
  // age: number;

  @IsOptional()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @ApiProperty({ description: "用户账号" })
  account: string;

  @IsNotEmpty()
  @ApiProperty({ description: "用户密码" })
  password: string;

  @IsOptional()
  @ApiProperty({ description: "验证码" })
  code: string;
}
