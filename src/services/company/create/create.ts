import { customCreate } from "../..";
import { URL } from "../../../constants/URL";

export const companyCreate = async ({    
  name,
  url,
  gst,
  nameOfPerson,
  phoneOfPerson,
  desgOfPerson,
  emailOfPerson,
  country,
  areaOfSpecialty,
  fb,
  instagram,
  linkedin,
  git,
  x,
  yt,
  pin,
  snap,
  tiktok,
  twitch,
  latlng,
  stepTwo
 }
: {
  name: string;
      url: string;
      gst?: string;
      nameOfPerson?: string;
      phoneOfPerson?: string;
      desgOfPerson?: string;
      emailOfPerson?: string;
      country?: string;
      areaOfSpecialty?: string;
      fb?: string;
      instagram?: string;
      linkedin?: string;
      git?: string;
      x?: string;
      yt?: string;
      pin?: string;
      snap?: string;
      tiktok?: string;
      twitch?: string;
      latlng?: string;
      stepTwo?: boolean;
}) => {
  const response:any = await customCreate(URL.companyCreate, {    
    name,
    url,
    gst,
    nameOfPerson,
    phoneOfPerson,
    desgOfPerson,
    emailOfPerson,
    country,
    areaOfSpecialty,
    fb,
    instagram,
    linkedin,
    git,
    x,
    yt,
    pin,
    snap,
    tiktok,
    twitch,
    latlng,
    stepTwo
}, true);
  if(!response.ok){
    console.log(response.message);
  }
  return response.json();
};
