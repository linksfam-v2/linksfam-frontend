import { HTTP_METHOD, URL } from "../../../constants/URL";

export const addMoneyCheckout = async ({ amount, merchantOrderId}: { amount:string, merchantOrderId:string }) => {
  const response:any = await customCreateNocors(URL.pgCheckout, {amount, merchantOrderId});
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};

export const customCreateNocors = <T>(url:string, data:T) => {
  return fetch(url, {
    method: HTTP_METHOD.POST,
    headers: {
      'Authorization':'Bearer '+localStorage?.getItem("token"),
      'Content-Type': 'application/json',
     
    },
    body: JSON.stringify(data)
  })
}