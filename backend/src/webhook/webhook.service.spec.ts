import { Test, TestingModule } from "@nestjs/testing";
import { WebhookService } from "./webhook.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AreaService } from "src/area/area.service";
import { SchedulerService } from "src/scheduler/scheduler.service";

describe("WebhookService", () => {
    let service: WebhookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WebhookService,
                { provide: PrismaService, useValue: {} },
                {
                    provide: AreaService,
                    useValue: {}
                },
                { provide: SchedulerService, useValue: {} }
            ]
        }).compile();

        service = module.get<WebhookService>(WebhookService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
