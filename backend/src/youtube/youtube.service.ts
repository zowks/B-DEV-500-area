import { HttpService } from "@nestjs/axios";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { YouTubeVideo } from "./interfaces/youtube-video.interface";
import { YouTubeVideoListResponse } from "./interfaces/repsonses.interface";
import { Poller } from "src/cron/interfaces/poller.interface";
import { YoutubeCredentialsService } from "./youtube_credentials.service";

@Injectable()
export class YouTubeService {
    private cache = {
        lastLikedVideoID: null,
        lastLikedVideoFirstRun: true
    };

    constructor(
        private readonly youtubeCredentialsService: YoutubeCredentialsService,
        private readonly httpService: HttpService
    ) {}

    async getOAuthToken(state: string) {
        return this.youtubeCredentialsService.getOAuthURL(state);
    }

    async getLastLikedVideo(accessToken: string): Promise<YouTubeVideo | null> {
        let result: YouTubeVideoListResponse;
        try {
            result = (
                await this.httpService.axiosRef.get<YouTubeVideoListResponse>(
                    "https://www.googleapis.com/youtube/v3/videos",
                    {
                        params: {
                            part: "id,snippet,statistics",
                            myRating: "like",
                            maxResults: 1
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )
            ).data;
        } catch (e) {
            if (403 === e.status)
                throw new ForbiddenException(
                    "Either the YouTube bearer token is invalid / expired, or you did not allow it to fetch your liked videos."
                );
            throw e;
        }
        if (1 !== result.items.length) return null;
        if (result.items[0].id === this.cache.lastLikedVideoID) return null;
        if (this.cache.lastLikedVideoFirstRun) {
            this.cache.lastLikedVideoFirstRun = false;
            this.cache.lastLikedVideoID = result.items[0].id;
            return null;
        }
        this.cache.lastLikedVideoID = result.items[0].id;
        return result.items[0];
    }

    getPollerForLastLikedVideo(accessToken: string): Poller<YouTubeVideo> {
        return {
            delay: 10,
            method: () => this.getLastLikedVideo(accessToken)
        };
    }
}
