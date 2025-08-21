import { customCreate } from "../..";
import { URL } from "../../../constants/URL";


export const addRefund = async ({ company_id, reason }: { company_id: string, reason: string }) => {
  const response:any = await customCreate(URL.addReason(company_id), {reason}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};
