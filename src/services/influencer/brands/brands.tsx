import { customCreate, customFetch } from "../..";
import { URL } from "../../../constants/URL";

export async function getBrands(url: string) {
  const response = await customFetch(url);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export async function getBrandsFilter(url: string, filterId: string, categoryId?: string, page: number = 1) {
  const query = categoryId ? `id=${filterId}&categoryId=${categoryId}&page=${page}` : `id=${filterId}&page=${page}`;
  const response = await customFetch(`${url}?${query}`);

  if (!response.ok) {
    console.error("Something went wrong, Please try again!");
    return null;
  }

  return response.json();
}

export async function getCampaignsFromVcommision(url: string) {
  const response = await customFetch(`${url}`);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}

export async function getBrandThirdParty(url: string) {
  const response = await customFetch(url);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
}


export const PostLinkData = async ({ link, input_type, status, fee, categoryId, brandId, type }: { link: string, input_type: string, status: boolean, fee: string, categoryId: string, brandId: string, type: string }) => {
  const response = await customCreate(URL.linkAdd(), { brandId, link, input_type, isActive: status, fee, categoryId: +categoryId, type }, true);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
};
export const PostLinkData2 = async ({ link, input_type, status, fee, categoryId, brandId, type }: { link: string, input_type: string, status: boolean, fee: string, categoryId: string, brandId: string, type: string }) => {
  const response = await customCreate(URL.linkAdd(), { brandId, link, input_type, isActive: status, fee, categoryId: +categoryId, type, isExploreBrandlink: true }, true);
  if (!response.ok) {
    console.log("Something went wrong, Please try again!");
  }
  return response.json();
};