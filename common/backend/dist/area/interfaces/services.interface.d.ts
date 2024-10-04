export type ActionTrigger = (accessToken: string) => Promise<any>;
export type ActionTriggers = {
    [name: string]: ActionTrigger;
};
export declare abstract class Action {
    abstract get triggers(): ActionTriggers;
    static get endpoints(): string[];
}
export type ReactionTrigger = (fields: object, data: object) => Promise<any>;
export type ReactionTriggers = {
    [name: string]: ReactionTrigger;
};
export declare abstract class Reaction {
    abstract get triggers(): ReactionTriggers;
    static get endpoints(): string[];
}
