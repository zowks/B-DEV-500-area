import { DescriptionParam } from "../../area/services/interfaces/service.interface";

export interface AboutJson {
    client: {
        host: string;
    };
    server: {
        current_time: number;
        services: {
            name: string;
            actions: {
                name: string;
                description: string;
                params: DescriptionParam[];
            }[];
            reactions: {
                name: string;
                description: string;
                params: DescriptionParam[];
            }[];
        }[];
    };
}
