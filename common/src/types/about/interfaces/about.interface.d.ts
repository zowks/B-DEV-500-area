import { ActionField, ReactionField } from "../../area/services/interfaces/service.interface";
declare class AboutJsonClient {
    readonly host: string;
}
declare class AboutJsonServerServiceAction {
    readonly name: string;
    readonly description: string;
    readonly fields: ActionField[];
    readonly oauthScopes?: string[];
}
declare class AboutJsonServerServiceReaction {
    readonly name: string;
    readonly description: string;
    readonly fields: ReactionField[];
    readonly oauthScopes?: string[];
}
declare class AboutJsonServerService {
    readonly name: string;
    readonly actions: AboutJsonServerServiceAction[];
    readonly reactions: AboutJsonServerServiceReaction[];
}
declare class AboutJsonServer {
    readonly current_time: number;
    readonly services: AboutJsonServerService[];
}
export declare class AboutJson {
    readonly client: AboutJsonClient;
    readonly server: AboutJsonServer;
}
export {};
