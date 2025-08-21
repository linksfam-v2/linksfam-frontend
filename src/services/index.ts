import { HTTP_METHOD } from "../constants/URL";


export const customFetch = (url:string) => {
    return  fetch(url, {
      method: HTTP_METHOD.GET,
      credentials: 'include',
      headers: {
        Authorization:'Bearer '+localStorage?.getItem("token"),
        'Content-Type': 'application/json',
      }
    },);
}

export const customCreate = <T>(url:string, data:T, tokenReq = true) => {
  return fetch(url, {
    method: HTTP_METHOD.POST,
    headers: tokenReq ? {
      Authorization:'Bearer '+localStorage?.getItem("token"),
      'Content-Type': 'application/json',
     
    } : {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
export const customPut = <T>(url:string, data:T, tokenReq = true) => {
  return fetch(url, {
    method: HTTP_METHOD.PUT,
    headers: tokenReq ? {
      Authorization:'Bearer '+localStorage?.getItem("token"),
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}