import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from "@nestjs/common";
import { ListService } from "./list.service";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("list")
@ApiTags("数据列表")
export class ListController {
  constructor(
    private readonly listService: ListService,
    @Inject("Config") private readonly base: any
  ) {}

  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  findAll() {
    return this.base;
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.listService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(+id, updateListDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.listService.remove(+id);
  }
}
