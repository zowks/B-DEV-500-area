import {
    ActionTrigger,
    ReactionTrigger
} from "../../area/interfaces/services.interface";
import { OAuth } from "../../oauth/oauth.interface";
export interface AreaTask {
    userId: string;
    oauthManager: OAuth;
    action: ActionTrigger;
    reaction: ReactionTrigger;
    fields: object;
    reactionBody: object;
    delay: number;
}
export interface AreaConfig {
    action: {
        service: string;
        method: string;
    };
    reaction: {
        service: string;
        method: string;
    };
}
