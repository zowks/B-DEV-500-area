import {
    YouTubeVideo,
    AreaYouTubeVideo
} from "./interfaces/youtubeVideo.interface";
import { transformYouTubeVideoToArea } from "./youtube.transformers";

describe("Raw YouTube video to AREA YouTube Video", () => {
    it("should transform a raw YouTube video to an AREA YouTube video object", () => {
        const rawYouTubeVideo: YouTubeVideo = {
            id: "YOUTUBE_VIDEO_ID",
            etag: "YOUTUBE_VIDEO_ETAG",
            kind: "YOUTUBE_VIDEO_KING",
            snippet: {
                categoryId: "YOUTUBE_VIDEO_CATEGORY_ID",
                channelId: "YOUTUBE_VIDEO_CHANNEL_ID",
                channelTitle: "YOUTUBE_VIDEO_CHANNEL_TITLE",
                description: "YOUTUBE_VIDEO_DESCRIPTION",
                liveBroadcastContent: "YOUTUBE_VIDEO_LIVE_BROARDCAST_CONTENT",
                localized: {
                    description: "YOUTUBE_VIDEO_LOCALIZED_DESCRIPTION",
                    title: "YOUTUBE_VIDEO_LOCALIZED_TITLE"
                },
                publishedAt:
                    "Tue Oct 22 2024 18:39:47 GMT+0200 (Central European Summer Time)",
                title: "YOUTUBE_VIDEO_TITLE",
                tags: ["YOUTUBE_VIDEO_TAGS_1", "YOUTUBE_VIDEO_TAGS_2"],
                thumbnails: {
                    default: {
                        height: 800,
                        width: 800,
                        url: "YOUTUBE_VIDEO_THUMBNAILS_DEFAULT_URL"
                    },
                    maxres: {
                        height: 800,
                        width: 800,
                        url: "YOUTUBE_VIDEO_THUMBNAILS_MAXRES_URL"
                    },
                    high: {
                        height: 800,
                        width: 800,
                        url: "YOUTUBE_VIDEO_THUMBNAILS_HIGH_URL"
                    },
                    medium: {
                        height: 800,
                        width: 800,
                        url: "YOUTUBE_VIDEO_THUMBNAILS_MEDIUM_URL"
                    },
                    standard: {
                        height: 800,
                        width: 800,
                        url: "YOUTUBE_VIDEO_THUMBNAILS_STANDARD_URL"
                    }
                }
            },
            statistics: {
                commentCount: "10",
                favoriteCount: "10",
                likeCount: "10",
                viewCount: "10"
            }
        };

        const areaYouTubeVideo = transformYouTubeVideoToArea(rawYouTubeVideo);

        expect(areaYouTubeVideo).toStrictEqual({
            channelId: rawYouTubeVideo.snippet.channelId,
            channelName: rawYouTubeVideo.snippet.channelTitle,
            description: rawYouTubeVideo.snippet.description,
            id: rawYouTubeVideo.id,
            likes: +rawYouTubeVideo.statistics.likeCount,
            views: +rawYouTubeVideo.statistics.viewCount,
            publishedAt: new Date(rawYouTubeVideo.snippet.publishedAt),
            tags: rawYouTubeVideo.snippet.tags,
            thumbnail: rawYouTubeVideo.snippet.thumbnails.maxres.url,
            title: rawYouTubeVideo.snippet.title,
            url: `https://youtube.com/watch?v=${rawYouTubeVideo.id}`
        } as AreaYouTubeVideo);
    });
});
