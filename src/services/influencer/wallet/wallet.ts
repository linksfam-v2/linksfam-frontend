import { customCreate, customFetch } from "../..";
import { URL } from "../../../constants/URL";

export async function getInfluencerWalletBalance(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export const walletRedeemAmount = async ({ influencerId, amount }: { influencerId: string, amount: string }) => {
  const response:any = await customCreate(URL.getInfluencerRedeem(), {influencerId, amount}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};


export async function getInfluencerTable(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}
