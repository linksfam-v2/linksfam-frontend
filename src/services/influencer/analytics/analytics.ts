
import { URL } from "../../../constants/URL";
import {customFetch} from "./../../index";

export async function getInfAnalytics({ filter, influencerId }: { influencerId: string, filter: string }) {
    const response = await customFetch(URL.getInfAnlytics(filter, influencerId));
    if(!response.ok){
      console.log("Something went wrong, Please try again!");
    }
    return response.json();
}

export async function geInftViews({ filter, influencerId }: { influencerId: string, filter: string }) {
  const response = await customFetch(URL.Infviews(filter, influencerId));
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}