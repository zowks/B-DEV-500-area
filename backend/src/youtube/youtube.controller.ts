import { getRandomValues } from "node:crypto";
import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { YouTubeService } from "./youtube.service";
import { Request, Response } from "express";
import { CronService } from "src/cron/cron.service";
import { DiscordService } from "src/discord/discord.service";
import { ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { YoutubeCredentialsService } from "./youtube_credentials.service";

@UseGuards(JwtGuard)
@ApiTags("youtube")
@ApiUnauthorizedResponse({
    description:
        "This route is protected. The client must supply a Bearer token."
})
@Controller("youtube")
export class YoutubeController {
    constructor(
        private readonly cronService: CronService,
        private readonly youtubeService: YouTubeService,
        private readonly youtubeCredentialsService: YoutubeCredentialsService,
        private readonly discordService: DiscordService
    ) {}

    @Get("/")
    oauthService(@Req() req: Request, @Res() res: Response) {
        const stateArrayView = new Uint32Array(16);
        getRandomValues(stateArrayView);
        const state = Buffer.from(stateArrayView.buffer).toString("hex");
        req.session["state"] = state;
        req.session.save(console.error);
        return res.redirect(this.youtubeCredentialsService.getOAuthURL(state));
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
