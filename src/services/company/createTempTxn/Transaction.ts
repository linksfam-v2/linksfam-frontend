import { customCreate } from "../..";
import { URL } from "../../../constants/URL";

export const companyCreateTempTxn = async ({amount, transId, companyId}: {amount:string, transId:string, companyId: string}) => {
  const response:any = await customCreate(URL.createTxn(companyId), {amount, transId}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};