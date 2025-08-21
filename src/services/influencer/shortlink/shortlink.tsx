import { customCreate, customFetch } from "../..";
import { URL } from "../../../constants/URL";

export const influencerShortLinkCreate = async ({ influencerId, linkId }: { influencerId: string, linkId: string }) => {
  const response: any = await customCreate(URL.createShortLink(), { influencerId, linkId }, true);
  if (!response.ok) {
    console.log(response.message);
  }
  return response.json();
};


export const influencerGetShortLink = async ({ url, influencerId }: { influencerId: string, url: string }) => {
  const response: any = await customCreate(url, { influencerId }, true);
  if (!response.ok) {
    console.log(response.message);
  }
  return response.json();
};

 export async function disconnectSocial(url: string) {
  const response = await customFetch(url);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}
