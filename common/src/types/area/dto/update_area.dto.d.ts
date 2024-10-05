import { AreaStatus } from "@prisma/client";
export declare class UpdateAreaDto {
    readonly name?: string;
    readonly description?: string;
    readonly reactionBody?: object;
    readonly reactionFields?: object;
    readonly delay?: number;
    readonly status?: AreaStatus;
}
