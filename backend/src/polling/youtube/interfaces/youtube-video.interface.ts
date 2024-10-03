import { ApiProperty } from "@nestjs/swagger";

abstract class YouTubeVideoThumbnail {
    @ApiProperty({ description: "The URL of the thumbnail image." })
    readonly url: string;

    @ApiProperty({ description: "The width of the thumbnail." })
    readonly width: number;

    @ApiProperty({ description: "The height of the thumbnail." })
    readonly height: number;
}

abstract class YouTubeVideoThumbnails {
    @ApiProperty({ description: "The video thumbnail in default quality." })
    readonly default: YouTubeVideoThumbnail;

    @ApiProperty({ description: "The video thumbnail in medium quality." })
    readonly medium: YouTubeVideoThumbnail;

    @ApiProperty({ description: "The video thumbnail in high quality." })
    readonly high: YouTubeVideoThumbnail;

    @ApiProperty({ description: "The video thumbnail in standard quality." })
    readonly standard: YouTubeVideoThumbnail;

    @ApiProperty({ description: "The video thumbnail in maxres quality." })
    readonly maxres: YouTubeVideoThumbnail;
}

abstract class YouTubeVideoSnippet {
    @ApiProperty({ description: "The date at which the video was published." })
    readonly publishedAt: string;

    @ApiProperty({ description: "The channel ID which published the video." })
    readonly channelId: string;

    @ApiProperty({ description: "The title of the video." })
    readonly title: string;

    @ApiProperty({ description: "The description of the video." })
    readonly description: string;

    @ApiProperty({
        description: "The different thumbnails resolutions of the video"
    })
    readonly thumbnails: YouTubeVideoThumbnails;

    @ApiProperty({
        description: "The channel title (or name) which published the video."
    })
    readonly channelTitle: string;

    @ApiProperty({ description: "The tags of the video." })
    readonly tags: string[];

    @ApiProperty({ description: "The category ID the video belongs to." })
    readonly categoryId: string;

    readonly liveBroadcastContent: string;
    readonly localized: {
        title: string;
        description: string;
    };
}

abstract class YouTubeVideoStatistics {
    @ApiProperty({ description: "The number of views." })
    readonly viewCount: string;

    @ApiProperty({ description: "The number of likes." })
    readonly likeCount: string;

    @ApiProperty({ description: "The number of favorite." })
    readonly favoriteCount: string;

    @ApiProperty({ description: "The number of comments." })
    readonly commentCount: string;
}

export class YouTubeVideo {
    readonly kind: string;

    readonly etag: string;

    @ApiProperty({ description: "The ID of the YouTube video." })
    readonly id: string;

    @ApiProperty({ description: "The info of the YouTube video." })
    readonly snippet: YouTubeVideoSnippet;

    @ApiProperty({ description: "The statistics of the YouTube video." })
    readonly statistics: YouTubeVideoStatistics;
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
    readonly published_at: Date;

    @ApiProperty({ description: "The list of tags." })
    readonly tags: string[];

    @ApiProperty({
        description: "The highest thumbnail quality of the YouTube video."
    })
    readonly thumbnail: string;
}
