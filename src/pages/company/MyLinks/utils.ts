import { ListProps } from "../../../components/Dropdown/Dropdown";

export interface Category {
  createdAt: string;
  id: number;
  name: string;
  updatedAt: string;
}
export const formatCategories = (list:Category[] ) => {
  const drodownVals = [];

  for(let i of list){
    drodownVals.push({
      label: i?.name,
      value:i?.id?.toString()
    })
  }

  return  drodownVals;
};

export const TYPE: ListProps[] = [
  {
    label: 'Cost per click',
    value: 'cpc',
  },
  {
    label: 'Cost per Conversion',
    value: 'cpcv',
    disabled:true,
  },
  {
    label: 'Lumpsump',
    value: 'lsp',
    disabled:true,
  },
  {
    label: 'MLM',
    value: 'mlm',
    disabled:true,
  },
  
]