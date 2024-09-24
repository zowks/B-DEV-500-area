import { YouTubeVideo } from './youtube-video';

export interface YouTubeVideoListResponse {
  kind: 'youtube#videoListResponse';
  etag: etag;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: integer;
    resultsPerPage: integer;
  };
  items: YouTubeVideo[];
}
