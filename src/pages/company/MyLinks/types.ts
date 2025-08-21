export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: number;
  categoryId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  currency: string;
  fee: string;
  isActive: boolean;
  link: string;
  type?:string;
}