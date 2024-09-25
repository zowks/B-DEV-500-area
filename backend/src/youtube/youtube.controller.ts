import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { YouTubeService } from "./youtube.service";
import { Request, Response } from "express";
import { CronService } from "src/cron/cron.service";
import { DiscordService } from "src/discord/discord.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("youtube")
@Controller("youtube")
export class YoutubeController {
    constructor(
        private readonly cronService: CronService,
        private readonly youtubeService: YouTubeService,
        private readonly discordService: DiscordService
    ) {}

    @Get("/")
    oauthService(@Res() res: Response) {
        return res.redirect(this.youtubeService.getOAuthURL());
    }

    // TODO: Implement the 'state' verification to avoid corss-site request
    //       forgery.
    @Get("/callback")
    callback(@Req() req: Request, @Res() res: Response) {
        const { access_token } = req.query;

        if (undefined === access_token)
            return res.send(
                `<script>window.onload=()=>{window.location=window.location.href.replace("callback#","cron?")}</script>`
            );

        return res.send("ok");
    }

    @Get("/cron")
    registerCron(@Query("access_token") accessToken: string) {
        this.cronService.createCron(
            this.youtubeService.getPollerForLastLikedVideo(accessToken),
            this.discordService.getPusherNewYouTubeLikedVideo()
        );
    }

    @Get("/video")
    getLastLikedVideo(@Query("access_token") accessToken: string) {
        return this.youtubeService.getLastLikedVideo(accessToken);
    }
}
