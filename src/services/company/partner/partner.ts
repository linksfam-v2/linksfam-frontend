
import { URL } from "../../../constants/URL";
import {customCreate, customFetch} from "./../../index";

export async function getPartner(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export async function getPartnerProduct(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}


export const bulkReqCreate = async ({ name, phone, qty, pName }: { name: string, phone: string, qty: string, pName:string }) => {
  const response:any = await customCreate(URL.bulkreq(), {name, phone, qty, pName}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};


export const createMiscInfluencer = async ({ influencerId, partnerId, otherInfo, bulkLink }: { influencerId: string, partnerId: string, otherInfo: string, bulkLink:string }) => {
  const response:any = await customCreate(URL.createMiscShortlink(), {influencerId, partnerId, otherInfo, bulkLink}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};
