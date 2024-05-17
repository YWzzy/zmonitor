import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestController } from "./test.controller";
import { Test } from "./entities/test.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
