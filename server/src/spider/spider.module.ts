import { Module } from "@nestjs/common";
import { SpiderService } from "./spider.service";
import { SpiderController } from "./spider.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
