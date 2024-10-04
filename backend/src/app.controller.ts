import { Controller, Get, Ip } from "@nestjs/common";
import { DescriptionParam } from "./area/services/interfaces/service.interface";
import discord from "./area/services/discord";
import youtube from "./area/services/youtube";

declare interface AboutJson {
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

@Controller()
export class AppController {
    @Get("/about.json")
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
