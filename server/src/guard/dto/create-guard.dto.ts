import { ApiProperty } from "@nestjs/swagger";

export class CreateGuardDto {
  @ApiProperty({ example: "王思聪", enum: [123] })
  name: string;
  @ApiProperty({ example: 18 })
  age: number;
}
