export interface DescriptionParam {
    name: string;
    type: string;
    description: string;
}

export interface ActionDescription {
    description: string;
    params: DescriptionParam[];
    trigger: (...args: any[]) => Promise<any>;
}

export interface ReactionDescription {
    description: string;
    params: DescriptionParam[];
    produce: (...args: any[]) => Promise<any>;
}
