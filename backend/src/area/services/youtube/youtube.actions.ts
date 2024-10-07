import axios, { AxiosRequestConfig } from "axios";
import {
    AreaYouTubeVideo,
    YouTubeVideoListResponse
} from "./interfaces/youtubeVideo.interface";
import { ForbiddenException } from "@nestjs/common";
import {
    ActionDescription,
    ActionResource,
    AreaServiceAuth
} from "../interfaces/service.interface";
import { transformYouTubeVideoToArea } from "./youtube.transformers";

function onLikedVideo(
    auth: AreaServiceAuth
): Promise<ActionResource> {
    const url = "https://www.googleapis.com/youtube/v3/videos";
    const config: AxiosRequestConfig = {
        params: {
            part: "id,snippet,statistics",
            myRating: "like",
            maxResults: 1
        },
        headers: {
            Authorization: `Bearer ${auth.oauth}`
        }
    };
    return new Promise((resolve, reject) => {
        axios
            .get<YouTubeVideoListResponse>(url, config)
            .then(({ data }) => {
                if (1 !== data.items.length) return null;
                const youtubeVideo = data.items[0];
                return resolve({
                    data: transformYouTubeVideoToArea(youtubeVideo),
                    cacheValue: youtubeVideo.id
                });
            })
            .catch((e) => {
                if (403 === e.status)
                    return reject(
                        new ForbiddenException("Access token expired.")
                    );
                return reject(e);
            });
    });
}

export const YOUTUBE_ACTIONS: { [name: string]: ActionDescription } = {
    on_liked_video: {
        description: "This event is triggered once a video has been liked.",
        oauthScopes: ["https://www.googleapis.com/auth/youtube.readonly"],
        auth: "oauth",
        trigger: onLikedVideo
    }
};
