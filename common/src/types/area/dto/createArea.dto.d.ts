import { AreaServiceAuthDto } from "./areaServiceAuth.dto";
export declare class CreateAreaDto {
    readonly name: string;
    readonly description: string;
    readonly actionId: string;
    readonly actionAuth: AreaServiceAuthDto;
    readonly reactionId: string;
    readonly reactionBody: object;
    readonly reactionAuth: AreaServiceAuthDto;
    readonly delay: number;
}
