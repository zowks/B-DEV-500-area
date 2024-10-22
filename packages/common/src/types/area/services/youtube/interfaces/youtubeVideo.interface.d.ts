declare interface YouTubeVideoThumbnail {
    url: string;
    width: number;
    height: number;
}
declare interface YouTubeVideoThumbnails {
    default: YouTubeVideoThumbnail;
    medium: YouTubeVideoThumbnail;
    high: YouTubeVideoThumbnail;
    standard: YouTubeVideoThumbnail;
    maxres: YouTubeVideoThumbnail;
}
declare interface YouTubeVideoLocalized {
    title: string;
    description: string;
}
declare interface YouTubeVideoSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeVideoThumbnails;
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: YouTubeVideoLocalized;
}
declare interface YouTubeVideoStatistics {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
}
export interface YouTubeVideo {
    kind: string;
    etag: string;
    id: string;
    snippet: YouTubeVideoSnippet;
    statistics: YouTubeVideoStatistics;
}
export interface YouTubeVideoListResponse {
    kind: "youtube#videoListResponse";
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: YouTubeVideo[];
}
export declare class AreaYouTubeVideo {
    readonly id: string;
    readonly url: string;
    readonly title: string;
    readonly description: string;
    readonly channelName: string;
    readonly channelId: string;
    readonly likes: number;
    readonly views: number;
    readonly publishedAt: Date;
    readonly tags: string[];
    readonly thumbnail: string;
}
export {};
