import { PartialType } from "@nestjs/swagger";
import { CreateAnalyseDto } from "./create-analyse.dto";

export class UpdateAnalyseDto extends PartialType(CreateAnalyseDto) {
  id: number;
}
