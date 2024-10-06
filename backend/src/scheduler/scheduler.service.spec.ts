import { Test, TestingModule } from "@nestjs/testing";
import { SchedulerService } from "./scheduler.service";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { AreaService } from "src/area/area.service";
import { OAuthService } from "src/oauth/oauth.service";

describe("SchedulerService", () => {
    let service: SchedulerService;
    let cache: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SchedulerService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn()
                    }
                },
                { provide: AreaService, useValue: {} },
                { provide: OAuthService, useValue: {} }
            ]
        }).compile();

        service = module.get<SchedulerService>(SchedulerService);
        cache = module.get(CACHE_MANAGER);
    });

    it("should be defined", () => {
        expect(cache).toBeDefined();
        expect(service).toBeDefined();
    });
});
