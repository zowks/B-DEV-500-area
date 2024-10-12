import { Test, TestingModule } from "@nestjs/testing";
import { AreaService } from "./area.service";
import { SchedulerService } from "src/scheduler/scheduler.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("AreaService", () => {
    let service: AreaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AreaService,
                { provide: PrismaService, useValue: {} },
                { provide: SchedulerService, useValue: {} }
            ]
        }).compile();

        service = module.get<AreaService>(AreaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
