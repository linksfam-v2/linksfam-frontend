
import { URL } from "../../../constants/URL";
import {customCreate, customFetch} from "./../../index";

export async function getCompanyLinks(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export const companyCreateLink = async ({category_id, link, fee, company_id, type, input_type}: {category_id:string,link:string, fee:string, company_id:string, type:string, input_type:string}) => {
  const response:any = await customCreate(URL.companyCreateLink, {category_id, link, fee:fee?.toString(), company_id, type, input_type}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export async function getCreators(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}