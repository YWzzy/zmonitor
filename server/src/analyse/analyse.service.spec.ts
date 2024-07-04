import { Test, TestingModule } from "@nestjs/testing";
import { AnalyseService } from "./analyse.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Analyse } from "./entities/analyse.entity";
import { Repository } from "typeorm";

describe("AnalyseService", () => {
  let service: AnalyseService;
  let repository: Repository<Analyse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyseService,
        {
          provide: getRepositoryToken(Analyse),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AnalyseService>(AnalyseService);
    repository = module.get<Repository<Analyse>>(getRepositoryToken(Analyse));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // 添加更多测试用例以确保服务的功能正常
});
