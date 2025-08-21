import { customCreate, customFetch, customPut } from "../..";
import { BASEURL, HTTP_METHOD } from "../../../constants/URL";

export interface RateCardData {
  reelCharge?: number | null;
  storyCharge?: number | null;
  carouselPostCharge?: number | null;
  linkInBioCharge?: number | null;
  instagramComboPackage?: number | null;
  youtubeShortCharge?: number | null;
  youtubeIntegrationCharge?: number | null;
  youtubeDedicatedVideoCharge?: number | null;
  customComboPackage?: string | null;
  minimumCollaborationValue?: number | null;
  availableForBarterDeals?: boolean;
}

export interface RateCard {
  id: number;
  reelCharge: number | null;
  storyCharge: number | null;
  carouselPostCharge: number | null;
  linkInBioCharge: number | null;
  instagramComboPackage: number | null;
  youtubeShortCharge: number | null;
  youtubeIntegrationCharge: number | null;
  youtubeDedicatedVideoCharge: number | null;
  customComboPackage: string | null;
  minimumCollaborationValue: number | null;
  availableForBarterDeals: boolean;
  influencerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RateCardResponse {
  success: boolean;
  message: string;
  data: RateCard;
}

export interface PublicRateCardResponse {
  success: boolean;
  data: {
    influencer: {
      id: number;
      name: string | null;
      city: string | null;
    };
    rateCard: RateCard;
  };
}

export const createRateCard = async (data: RateCardData): Promise<RateCardResponse> => {
  const response = await customCreate(`${BASEURL}/influencer/rate-card`, data, true);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create rate card");
  }
  return response.json();
};

export const updateRateCard = async (data: RateCardData): Promise<RateCardResponse> => {
  const response = await customPut(`${BASEURL}/influencer/rate-card`, data, true);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update rate card");
  }
  return response.json();
};

export const getMyRateCard = async (): Promise<RateCardResponse> => {
  const response = await customFetch(`${BASEURL}/influencer/rate-card`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch rate card");
  }
  return response.json();
};

export const getRateCard = async (influencerId: string): Promise<PublicRateCardResponse> => {
  const response = await fetch(`${BASEURL}/rate-card?influencerId=${influencerId}`, {
    method: HTTP_METHOD.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch rate card");
  }
  return response.json();
}; 