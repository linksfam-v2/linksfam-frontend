import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyId } from "../../services/company/profile/profile";
import { URL } from "../../constants/URL";
import { useEffect } from "react";
import authStore from "../../store/company/auth";

const CompanyBaseWithoutNav = () => {

  const { setCompanyId } = authStore();

  const { data } = useQuery({
    queryKey: ['COMPANY_ID'], // Wrap the key in an array
    queryFn: () => getCompanyId(URL.getCompanyProfile),  // The function to fetch data  // The function to fetch data
  });

  useEffect(() => {
    if (data?.data?.length) {
      const id = (data?.data[0]?.id);
      setCompanyId(id);
    }
  }, [data?.data])

  return (
    <div className="">
      <Outlet />
    </div>
  )
}

export default CompanyBaseWithoutNav;
