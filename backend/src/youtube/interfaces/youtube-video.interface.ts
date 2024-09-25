declare interface YouTubeVideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: YouTubeVideoThumbnail;
      medium: YouTubeVideoThumbnail;
      high: YouTubeVideoThumbnail;
      standard: YouTubeVideoThumbnail;
      maxres: YouTubeVideoThumbnail;
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}
