
import { URL } from "../../../constants/URL";
import {customFetch} from "./../../index";

export async function getAnalytics({ filter, companyId }: { companyId: string, filter: string }) {
    const response = await customFetch(URL.getAnlytics(filter, companyId));
    if(!response.ok){
      console.log("Something went wrong, Please try again!");
    }
    return response.json();
}

export async function getViews({ filter, companyId }: { companyId: string, filter: string }) {
  const response = await customFetch(URL.views(filter, companyId));
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}