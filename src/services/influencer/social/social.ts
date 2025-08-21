import { customCreate, customFetch } from "../..";
import { URL } from "../../../constants/URL";

// Cross-posting interfaces
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
  duration?: string;
  isShort?: boolean;
}

export interface YouTubeVideosResponse {
  code: number;
  status: string;
  data: YouTubeVideo[];
  message: string;
}

export interface CrossPostRequest {
  videoId: string;
  caption?: string;
}

export interface CrossPostResponse {
  success: boolean;
  message: string;
  data: {
    youtubeVideoId: string;
    youtubeVideoTitle: string;
    instagramPostId: string;
    instagramMediaId: string;
    caption: string;
  };
}

export const socialCreate = async () => {
  const response: any = await customCreate(URL.createUser, {}, true);
  if (!response.ok) {
    console.log(response.message);
  }
  return response.json();
};


export async function getAccounts(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export const socialdisconnect = async (id:string) => {
  const response: any = await customCreate(URL.disconnect, {id}, true);
  if (!response.ok) {
    console.log(response.message);
  }
  return response.json();
};

// Cross-posting functions
export const getYouTubeVideos = async (pageToken?: string): Promise<YouTubeVideosResponse> => {
  const url = pageToken ? `${URL.getYouTubeVideos()}?pageToken=${pageToken}` : URL.getYouTubeVideos();
  const response = await customFetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch YouTube videos");
  }
  return response.json();
};

export const crossPostToInstagram = async (data: CrossPostRequest): Promise<CrossPostResponse> => {
  const response = await customCreate(URL.crossPostToInstagram(), data, true);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to cross-post to Instagram");
  }
  return response.json();
};

