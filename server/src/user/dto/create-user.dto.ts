import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsNumber()
  // age: number;

  desc: string;
}
