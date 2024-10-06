import { ApiProperty } from "@nestjs/swagger";

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

export class AreaYouTubeVideo {
    @ApiProperty({ description: "The YouTube video ID." })
    readonly id: string;

    @ApiProperty({ description: "The YouTube video URL." })
    readonly url: string;

    @ApiProperty({ description: "The YouTube video title." })
    readonly title: string;

    @ApiProperty({ description: "The YouTube video description." })
    readonly description: string;

    @ApiProperty({
        description: "The YouTube channel name which published the video."
    })
    readonly channelName: string;

    @ApiProperty({
        description: "The YouTube channel ID which published the video."
    })
    readonly channelId: string;

    @ApiProperty({ description: "The number of likes of the YouTube video." })
    readonly likes: number;

    @ApiProperty({ description: "The number of views of the YouTube video." })
    readonly views: number;

    @ApiProperty({
        description: "The date to which the YouTube video was pulished."
    })
    readonly publishedAt: Date;

    @ApiProperty({ description: "The list of tags." })
    readonly tags: string[];

    @ApiProperty({
        description: "The highest thumbnail quality of the YouTube video."
    })
    readonly thumbnail: string;
}
