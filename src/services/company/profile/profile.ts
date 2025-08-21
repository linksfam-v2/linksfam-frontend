
import {customFetch} from "./../../index";

export async function getCompanyId(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}


export async function getCompanyProfile(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}