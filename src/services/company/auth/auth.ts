import { toast } from "react-toastify";
import { customCreate } from "../..";
import { USER_TYPE } from "../../../constants/conts";
import { URL } from "../../../constants/URL";

export const postLogin = async (email :string) => {
  const response:any = await customCreate(URL.companyLogin, {email, type: USER_TYPE.COMPAMY}, false);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export const postOtp = async ({otp, email, share} :{otp:string, email :string, share:string}) => {
  const response:any = await customCreate(URL.companyOtp, {email, otp, share}, false);

  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export const postotp = async (email :string) => {
  const response:any = await customCreate(URL.resendcompanyLogin, {authData: email}, false);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export async function googleLogin(url:string, name:string, email:string, share:string) {
  const response:any =  await customCreate(url, {name, email, type:'COMPANY', share}, false);
  if(!response.ok){
    const data = await response.json();
    toast(data.message || "Something went wrong!");
  }
  return response.json();
}