import { customFetch } from "../..";

export async function getInfluencerTransactions(url:string) {
  const response = await customFetch(url);
  if(!response.ok){
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}
