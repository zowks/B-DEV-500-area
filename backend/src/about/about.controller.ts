import { Controller, Get, Ip } from "@nestjs/common";
import { AboutJson } from "./interfaces/about.interface";
import discord from "../area/services/discord";
import youtube from "../area/services/youtube";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

@Controller()
export class AboutController {
    @Get("/about.json")
    @ApiExtraModels(AboutJson)
    @ApiOkResponse({
        description:
            "All the informations related to client and mostly server, including the supported AREAs.",
        schema: {
            $ref: getSchemaPath(AboutJson)
        }
    })
    about(@Ip() host: string): AboutJson {
        const now = new Date().getTime();
        return {
            client: {
                host
            },
            server: {
                current_time: now,
                services: [discord, youtube]
            }
        };
    }
}
