import { ApiPropertyOptional } from "@nestjs/swagger";
import { AreaStatus } from "@prisma/client";
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { AreaServiceAuthDto } from "./areaServiceAuth.dto";

@ValidatorConstraint({ name: "UpdateAreaDto", async: false })
class UpdateAreaDtoConstraint implements ValidatorConstraintInterface {
    validate(_prop: object, clazz: ValidationArguments) {
        const dto = clazz.object as UpdateAreaDto;
        const statusKeys = [
            AreaStatus.RUNNING,
            AreaStatus.STOPPED,
            AreaStatus.ERROR
        ];

        if (!statusKeys.includes(dto.status)) return false;

        if (
            undefined !== dto.actionAuth?.webhook &&
            "local" !== dto.actionAuth?.webhook
        )
            return false;

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Invalid value for ${args.property} : ${args.value}.`;
    }
}

export class UpdateAreaDto {
    @ApiPropertyOptional({
        description: "The name of the AREA being created.",
        example: "LikeNotifier"
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(255)
    readonly name?: string;

    @ApiPropertyOptional({
        description: "The description of the AREA being created.",
        example:
            "This AREA will notify me every time I like a new video via a Discord webhook."
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly description?: string;

    @ApiPropertyOptional({
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
    @IsOptional()
    @Validate(UpdateAreaDtoConstraint, {
        message(validationArguments) {
            return `Invalid value for ${validationArguments.property} : ${JSON.stringify(validationArguments.object)}`;
        }
    })
    readonly actionAuth?: AreaServiceAuthDto;

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
    @IsOptional()
    @IsObject()
    readonly reactionBody?: object;

    @ApiPropertyOptional({
        description:
            "The action service authentication method used to post data. 'oauth' is the ID of the OAuth credential stored in database.",
        type: AreaServiceAuthDto,
        examples: [
            { apiKey: "<API_KEY_HERE>" },
            { oauth: 1 },
            { webhook: "https://discord.com/webhooks/webhookId/webhookSecret" }
        ]
    })
    @IsObject()
    @IsOptional()
    @Validate(UpdateAreaDtoConstraint, {
        message(validationArguments) {
            return `Invalid value for ${validationArguments.property} : ${JSON.stringify(validationArguments.object)}`;
        }
    })
    readonly reactionAuth?: AreaServiceAuthDto;

    @ApiPropertyOptional({
        description:
            "The delay in seconds to which the poll-based event should be triggered. If the 'actionAuth' is a webhook, this value is ignored.",
        example: 10
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Validate(UpdateAreaDtoConstraint)
    readonly delay?: number;

    @ApiPropertyOptional({
        description: "The AREA status.",
        enum: [AreaStatus.RUNNING, AreaStatus.STOPPED, AreaStatus.ERROR]
    })
    @IsOptional()
    @Validate(UpdateAreaDtoConstraint)
    readonly status?: AreaStatus;
}
