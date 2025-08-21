export interface InstagramPost {
  id: string | number;
  caption: string;
  postId?: string;
  media_type: 'IMAGE' | 'VIDEO' | null;
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
  socialId?: number;
}

export interface YouTubeVideo {
  id: number;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  publishedDate: string;
  likes: number;
  comments: number;
  viewCount: number;
  socialId: number;
}

export interface SocialMediaData {
  biography?: string;
  followers_count?: number;
  name?: string;
  username?: string;
  profile_picture_url?: string;
  media_count?: number;
  follows_count?: number;
  id: string;
  socialMediaType: 'youtube' | 'instagram';
} 