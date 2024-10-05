import { AreaStatus, OAuthCredential } from "@prisma/client";
import {
    ActionDescription,
    ReactionDescription
} from "../services/interfaces/service.interface";
import { ApiProperty } from "@nestjs/swagger";
import { OAuth } from "src/oauth/oauth.interface";

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

export abstract class Area {
    @ApiProperty({
        description: "The AREA id."
    })
    readonly id: string;

    @ApiProperty({
        description: "The AREA name."
    })
    readonly name: string;

    @ApiProperty({
        description: "The AREA description."
    })
    readonly description: string;

    @ApiProperty({
        description: "The AREA Action ID.",
        example: "youtube.on_liked_video"
    })
    readonly action_id: string;

    @ApiProperty({
        description: "The AREA Reaction ID.",
        example: "discord.send_embed"
    })
    readonly reaction_id: string;

    @ApiProperty({
        description:
            "The Reaction body. It contains all the fields of the data to be built. It also may contain variable refering to the Action data.",
        example: {
            title: "You liked the video {{title}}.",
            description: "You can access the video by clicking [here]({{url}})",
            imageUrl: "{{thumbnail}}",
            authorName: "{{channelName}}",
            authorUrl: "https://youtube.com/channel/{{channelId}}"
        }
    })
    readonly reaction_body: object;

    @ApiProperty({
        description:
            "The fields represent the required elements to make the reaction possible. For instance, it may contain a webhook URL.",
        example: {
            webhook:
                "https://discord.com/api/webhooks/XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX"
        }
    })
    readonly reaction_fields: object;

    @ApiProperty({
        description:
            "The delay in seconds to which the poll-based event should be triggered.",
        example: 10
    })
    readonly delay: number;

    @ApiProperty({
        description: "The current state of the AREA.",
        examples: [AreaStatus.RUNNING, AreaStatus.STOPPED, AreaStatus.ERROR],
        default: AreaStatus.STOPPED
    })
    readonly status: AreaStatus;
}
