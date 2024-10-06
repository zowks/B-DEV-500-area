import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    MaxLength,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { AreaServiceAuthDto } from "./areaServiceAuth.dto";
import { Optional } from "@nestjs/common";
import { AreaStatus } from "@prisma/client";

@ValidatorConstraint({ name: "CreateAreaDto", async: false })
class CreateAreaDtoConstraint implements ValidatorConstraintInterface {
    validate(_prop: object, clazz: ValidationArguments) {
        const dto = clazz.object as CreateAreaDto;

        if (
            undefined !== dto.actionAuth.webhook &&
            "local" !== dto.actionAuth.webhook
        )
            return false;

        if (undefined === dto.actionAuth.webhook && null === dto.delay)
            return false;

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Invalid value for ${args.property} : ${args.value}.`;
    }
}

export class CreateAreaDto {
    @ApiProperty({
        description: "The name of the AREA being created.",
        example: "LikeNotifier"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly name: string;

    @ApiProperty({
        description: "The description of the AREA being created.",
        example:
            "This AREA will notify me every time I like a new video via a Discord webhook."
    })
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @ApiProperty({
        description:
            "The action ID. It must contain the service and the method separated by a dot.",
        example: "youtube.on_liked_video"
    })
    @IsString()
    @Matches(/[a-z_]+\.[a-z_]+/)
    @IsNotEmpty()
    readonly actionId: string;

    @ApiProperty({
        description:
            "The action service authentication method used to receive data. The webhook value for this attribute MUST BE 'local'. 'oauth' is the ID of the OAuth credential stored in database.",
        type: AreaServiceAuthDto,
        examples: [
            { apiKey: "<API_KEY_HERE>" },
            { oauth: 1 },
            { webhook: "local" }
        ]
    })
    @IsObject()
    @Validate(CreateAreaDtoConstraint, {
        message(validationArguments) {
            return `Invalid value for ${validationArguments.property} : ${JSON.stringify(validationArguments.object)}`;
        }
    })
    readonly actionAuth: AreaServiceAuthDto;

    @ApiProperty({
        description:
            "The reaction ID. It must contain the service and the method separated by a dot.",
        example: "discord.send_embed"
    })
    @IsString()
    @Matches(/[a-z_]+\.[a-z_]+/)
    @IsNotEmpty()
    readonly reactionId: string;

    @ApiPropertyOptional({
        description:
            "The object representing the reaction payload. It may contain variables from the action object.",
        example: {
            title: "You liked the video {{title}}.",
            description: "You can access the video by clicking [here]({{url}})",
            imageUrl: "{{thumbnail}}",
            authorName: "{{channelName}}",
            authorUrl: "https://youtube.com/channel/{{channelId}}"
        }
    })
    @IsObject()
    readonly reactionBody: object;

    @ApiProperty({
        description:
            "The reaction service authentication method used to post data. 'oauth' is the ID of the OAuth credential stored in database.",
        type: AreaServiceAuthDto,
        examples: [
            { apiKey: "<API_KEY_HERE>" },
            { oauth: 1 },
            { webhook: "https://discord.com/webhooks/webhookId/webhookSecret" }
        ]
    })
    @IsObject()
    @Validate(CreateAreaDtoConstraint, {
        message(validationArguments) {
            return `Invalid value for ${validationArguments.property} : ${JSON.stringify(validationArguments.object)}`;
        }
    })
    readonly reactionAuth: AreaServiceAuthDto;

    @ApiPropertyOptional({
        description:
            "The delay in seconds to which the poll-based event should be triggered. If the 'actionAuth' is a webhook, this value is ignored.",
        example: 10
    })
    @IsNumber()
    @Optional()
    @IsPositive()
    @Validate(CreateAreaDtoConstraint)
    readonly delay: number;
}
