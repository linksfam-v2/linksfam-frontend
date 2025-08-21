import { customCreate } from "../..";
import { URL } from "../../../constants/URL";

interface CreateShopPostData {
  title: string;
  description: string;
  productUrls: string[];
  mediaUrl: string;
  thumbnailUrl?: string;
  igPostId?: string;
  mediaExpiry?: string;
}

export const createShopPost = async (data: CreateShopPostData) => {
  const response: any = await customCreate(URL.getShopPosts(), data, true);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}; 