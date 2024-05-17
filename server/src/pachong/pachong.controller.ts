import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PachongService } from "./pachong.service";
import { CreatePachongDto } from "./dto/create-pachong.dto";
import { UpdatePachongDto } from "./dto/update-pachong.dto";
import { QueryPachongDto } from "./dto/query-pachong.dto";
import { HttpService } from "@nestjs/axios";
import { ApiTags } from "@nestjs/swagger";

@Controller("pachong")
@ApiTags("爬取汽车图片")
export class PachongController {
  constructor(private readonly pachongService: PachongService) {}

  @Post()
  create(@Body() createPachongDto: CreatePachongDto) {
    return this.pachongService.create(createPachongDto);
  }

  @Get("getCarImgs")
  findAll(@Body() queryPachongDto: QueryPachongDto) {
    return this.pachongService.findAll(queryPachongDto);
  }

  @Post("getCarInfo")
  findCarInfo(@Body() queryPachongDto: QueryPachongDto) {
    return this.pachongService.findCarInfo(queryPachongDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.pachongService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePachongDto: UpdatePachongDto) {
    return this.pachongService.update(+id, updatePachongDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.pachongService.remove(+id);
  }
}
