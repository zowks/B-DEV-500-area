import { AreaStatus, OAuthCredential } from "@prisma/client";
import { ActionDescription, ReactionDescription } from "../services/interfaces/service.interface";
import { OAuth } from "../../oauth/oauth.interface";
export interface AreaAction {
    service: string;
    method: string;
    config: ActionDescription;
}
export interface AreaReaction {
    service: string;
    method: string;
    config: ReactionDescription;
}
export interface AreaTask {
    areaId: Area["id"];
    name: string;
    credentialsManager: OAuth;
    oauthCredentialId: OAuthCredential["id"];
    action: AreaAction;
    reaction: AreaReaction;
    reactionBody: object;
    reactionFields: object;
    delay: number;
}
export declare abstract class Area {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly action_id: string;
    readonly reaction_id: string;
    readonly reaction_body: object;
    readonly reaction_fields: object;
    readonly delay: number;
    readonly status: AreaStatus;
}
