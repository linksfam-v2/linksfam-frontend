import { create } from "zustand";

export type InfluencerUserStore = {
  influencerId:string;
  influencerUser:InfluencerUser | "",
  setInfluencerUser:(_: InfluencerUser) => void,
  resetInfluencerUser:() => void
  setInfluencerId: (_id:number) => void;
  removeInfluencerId:() => void;
};

export type InfluencerUser = {
  createdAt: string;
  email: string; 
  id: number; 
  isActive: boolean;
  otp: string;
  phone: string | null; 
  token: string; 
  type: string;
  updatedAt: string;
};


const influencerAuthStore = create<InfluencerUserStore>((set) => ({
  influencerId: "",
  setInfluencerId: (id:number) => set((store:InfluencerUserStore) => ({...store, influencerId:id?.toString()})),
  removeInfluencerId: () =>set((store) => ({...store, influencerId:""})),
  influencerUser: "",
  setInfluencerUser: (u:InfluencerUser) => set((store:InfluencerUserStore) => ({...store, influencerUser:u})),
  resetInfluencerUser: () => set((store:InfluencerUserStore) => ({...store, influencerUser: ""})),
}));

export default influencerAuthStore;