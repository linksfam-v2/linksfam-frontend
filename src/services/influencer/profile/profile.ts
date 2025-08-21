import { customCreate, customFetch, customPut } from "../..";
import { URL } from "../../../constants/URL";

export async function getInfluencerId(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}
export async function getInfluencerIgPage(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export async function getUserid(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export async function getUserInfluencerId(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}



export const influencerCreate = async ({name, city, whatsapp, email}: {name:string, city:string, whatsapp:string, email:string}) => {
  const response:any = await customCreate(URL.influencerProfileCreate, {name, city, whatsapp, email}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export async function getSocialdets(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export async function checkEligibility(url:string) {
  const response = await customCreate(url, {}, true);
  if(!response.ok){
    console.log("Eligibility check failed, Please try again!");
  }
  return response.json();
}

export const updateSocialWebsite = async ({ socialMediaType, website }: { socialMediaType: string, website: string | null }) => {
  const response = await customPut(URL.updateSocialWebsite(), { socialMediaType, website }, true);
  if(!response.ok){
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update website");
  }
  return response.json();
};
