import * as axios from "axios";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { AreaYouTubeVideo } from "./interfaces/youtube-video.interface";
import { YouTubeVideoListResponse } from "./interfaces/youtube-video.interface";
import { Action } from "src/area/interfaces/services.interface";

@Injectable()
export class YouTubeService implements Action {
    get triggers() {
        return {
            last_liked_video: this.getLastLikedVideo
        };
    }

    static get endpoints() {
        return ["last_liked_video"];
    }

    async getLastLikedVideo(
        accessToken: string
    ): Promise<AreaYouTubeVideo | null> {
        let result: YouTubeVideoListResponse;
        try {
            result = (
                await axios.default.get<YouTubeVideoListResponse>(
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
        const youtubeVideo = result.items[0];
        return {
            id: youtubeVideo.id,
            url: `https://youtube.com/watch?q=${youtubeVideo.id}`,
            title: youtubeVideo.snippet.title,
            description: youtubeVideo.snippet.description,
            channelName: youtubeVideo.snippet.channelTitle,
            channelId: youtubeVideo.snippet.channelId,
            likes: +youtubeVideo.statistics.likeCount,
            views: +youtubeVideo.statistics.viewCount,
            published_at: new Date(youtubeVideo.snippet.publishedAt),
            tags: youtubeVideo.snippet.tags,
            thumbnail: youtubeVideo.snippet.thumbnails.maxres.url
        };
    }
}
