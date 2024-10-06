import { ApiProperty } from "@nestjs/swagger";
import { ReactionField } from "../../area/services/interfaces/service.interface";

class AboutJsonClient {
    @ApiProperty({ description: "The host (IP address) of the client." })
    readonly host: string;
}

class AboutJsonServerServiceAction {
    @ApiProperty({
        description: "The name of the action."
    })
    readonly name: string;

    @ApiProperty({
        description: "The description of the action."
    })
    readonly description: string;
}

class AboutJsonServerServiceReaction {
    @ApiProperty({
        description: "The name of the reaction."
    })
    readonly name: string;

    @ApiProperty({
        description: "The description of the reaction."
    })
    readonly description: string;

    @ApiProperty({
        description: "The fields required to execute the reaction.",
        type: ReactionField,
        isArray: true
    })
    readonly fields: ReactionField[];
}

class AboutJsonServerService {
    @ApiProperty({
        description: "The name of the service",
        examples: ["youtube", "discord"]
    })
    readonly name: string;

    @ApiProperty({
        description: "The actions available for this service.",
        type: AboutJsonServerServiceAction,
        isArray: true
    })
    readonly actions: AboutJsonServerServiceAction[];

    @ApiProperty({
        description: "The reactions available for this service.",
        type: AboutJsonServerServiceReaction,
        isArray: true
    })
    readonly reactions: AboutJsonServerServiceReaction[];
}

class AboutJsonServer {
    @ApiProperty({
        description: "The current time based on the server's hardware."
    })
    readonly current_time: number;

    @ApiProperty({
        description: "The list of the supported AREAs.",
        type: AboutJsonServerService,
        isArray: true
    })
    readonly services: AboutJsonServerService[];
}

export class AboutJson {
    @ApiProperty({ description: "All the information related to the client." })
    readonly client: AboutJsonClient;

    @ApiProperty({
        description:
            "Some informations about the server, including the supported AREAs."
    })
    readonly server: AboutJsonServer;
    // current_time: number;
    // services: {
    //     name: string;
    //     actions: {
    //         name: string;
    //         description: string;
    //         params: DescriptionParam[];
    //     }[];
    //     reactions: {
    //         name: string;
    //         description: string;
    //         params: DescriptionParam[];
    //     }[];
    // }[];
}
