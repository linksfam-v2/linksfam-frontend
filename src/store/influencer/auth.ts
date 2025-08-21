import { create } from "zustand";

export type InfluencerUserStore = {
  influencerUser:InfluencerUser | "",
  setInfluencerUser:(_: InfluencerUser) => void,
  resetInfluencerUser:() => void
  googleName: string,
  setGoogleName: (_:string) => void,
  resetGoogleName:() => void,
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


const authInfluencerStore = create<InfluencerUserStore>((set) => ({
  googleName: '',
  influencerUser: "",
  setInfluencerUser: (u:InfluencerUser) => set((store:InfluencerUserStore) => ({...store, influencerUser:u})),
  resetInfluencerUser: () => set((store:InfluencerUserStore) => ({...store, influencerUser: ""})),
  setGoogleName: (name:string) => set((store:InfluencerUserStore) => ({...store, googleName: name})),
  resetGoogleName: () => set((store:InfluencerUserStore) => ({...store, googleName: ""})),
}));

export default authInfluencerStore;