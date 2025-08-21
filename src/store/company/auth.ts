import { create } from "zustand";

export type CompanyUserStore = {
  companyId:string;
  companyUser:CompanyUser | "",
  setCompanyUser:(_: CompanyUser) => void,
  resetCompanyUser:() => void
  setCompanyId: (_id:number) => void;
  removeCompanyId:() => void;
};

export type CompanyUser = {
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


const authStore = create<CompanyUserStore>((set) => ({
  companyId: "",
  setCompanyId: (id:number) => set((store:CompanyUserStore) => ({...store, companyId:id?.toString()})),
  removeCompanyId: () =>set((store) => ({...store, companyId:""})),
  companyUser: "",
  setCompanyUser: (u:CompanyUser) => set((store:CompanyUserStore) => ({...store, companyUser:u})),
  resetCompanyUser: () => set((store:CompanyUserStore) => ({...store, companyUser: ""})),
}));

export default authStore;