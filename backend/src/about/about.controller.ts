import { Controller, Get, Ip } from "@nestjs/common";
import { AboutJson } from "./interfaces/about.interface";
import discord from "../area/services/discord";
import youtube from "../area/services/youtube";

@Controller()
export class AboutController {
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
