import { toast } from "react-toastify";
import { customCreate } from "../..";
import { USER_TYPE } from "../../../constants/conts";
import { URL } from "../../../constants/URL";

export const postInfluencerLogin = async (phone :string) => {
  const response:any = await customCreate(URL.influencerLogin, {phone, type: USER_TYPE.INFLUENCER}, false);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export const postInfluencerOtp = async ({otp, phone, share} :{otp:string, phone :string, share:string }) => {
  const response:any = await customCreate(URL.companyOtp, {phone, otp, share}, false);

  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export const postInfluencerOTP = async (phone :string) => {
  const response:any = await customCreate(URL.resendcompanyLogin, {authData: phone}, false);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export async function googleLoginInf(url:string, name:string, email:string, share:string) {
  const response =  await customCreate(url, {name, email, type:'INFLUENCER', share}, false);
  if(!response.ok){
    const data = await response.json();
    toast(data.message || "Something went wrong!");
  }
  return response.json();
}