import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PerformanceService } from "./performance.service";
import { PerformanceController } from "./performance.controller";
import { Performance } from "./entities/performance.entity";
import { Resource } from "./entities/resource.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Performance, Resource])],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
