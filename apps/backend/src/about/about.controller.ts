import { Controller, Get, Ip } from "@nestjs/common";
import { AboutJson } from "./interfaces/about.interface";
import * as services from "../area/services/index";
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
        const _services = Object.values(services).map(({ default: d }) => d);

        return {
            client: {
                host
            },
            server: {
                current_time: Date.now(),
                services: _services
            }
        };
    }
}
