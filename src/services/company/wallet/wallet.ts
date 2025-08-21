import { customCreate, customFetch } from "../..";
import { URL } from "../../../constants/URL";

export async function getWalletBalance(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export const walletRechargeAmount = async ({ status }: { status:string }) => {
  const response:any = await customCreate(URL.rechargeWallet(), {status}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};


export const initRechargeAmount = async ({ company_id, amount, merchantOrderId }: { company_id: string, amount: string, merchantOrderId:string }) => {
  const response:any = await customCreate(URL.initWallet(), {company_id, amount, merchantOrderId}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};
