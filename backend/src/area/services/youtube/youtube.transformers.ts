import {
    YouTubeVideo,
    AreaYouTubeVideo
} from "./interfaces/youtubeVideo.interface";

export function transformYouTubeVideoToArea(
    raw: YouTubeVideo
): AreaYouTubeVideo {
    const {
        default: low,
        medium,
        high,
        standard,
        maxres
    } = raw.snippet.thumbnails;
    return {
        id: raw.id,
        url: `https://youtube.com/watch?q=${raw.id}`,
        title: raw.snippet.title,
        description: raw.snippet.description,
        channelName: raw.snippet.channelTitle,
        channelId: raw.snippet.channelId,
        likes: +raw.statistics.likeCount,
        views: +raw.statistics.viewCount,
        publishedAt: new Date(raw.snippet.publishedAt),
        tags: raw.snippet.tags ?? [],
        thumbnail: (maxres ?? standard ?? high ?? medium ?? low).url
    };
}
