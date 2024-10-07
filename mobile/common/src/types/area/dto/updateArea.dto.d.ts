import { AreaStatus } from "@prisma/client";
import { AreaServiceAuthDto } from "./areaServiceAuth.dto";
export declare class UpdateAreaDto {
    readonly name?: string;
    readonly description?: string;
    readonly actionAuth?: AreaServiceAuthDto;
    readonly reactionBody?: object;
    readonly reactionAuth?: AreaServiceAuthDto;
    readonly delay?: number;
    readonly status?: AreaStatus;
}
