import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyId } from "../../services/company/profile/profile";
import { URL } from "../../constants/URL";
import { useEffect, useState } from "react";
import authStore from "../../store/company/auth";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoWalletOutline, IoPeopleCircle } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Menu from "../../components/Menu/Menu";
import Avatar from "../../components/Avatar/Avatar";
import { USER_TYPE } from "../../constants/conts";
import { RiAdvertisementLine } from "react-icons/ri";
import { cn } from "../../lib/utils";
// import Support from "../../assets/images/help-desk.png";

const CompanyBase = () => {
  const { setCompanyId } = authStore();
  const [bottomText, setBottomText] = useState("Home");
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['COMPANY_ID'],
    queryFn: () => getCompanyId(URL.getCompanyProfile),
  });

  useEffect(() => {
    if (data?.data?.length) {
      const id = (data?.data[0]?.id);
      setCompanyId(id);
    }
  }, [data?.data]);

  const logout = () => {
    const type = localStorage.getItem("type");
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    if (type === USER_TYPE.COMPAMY) {
      navigate("/brand/login");
    } else {
      navigate("/creator/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-lg font-semibold text-gray-900">{bottomText}</h1>
        <Menu 
          title={<Avatar name={data?.data[0]?.name ?? "P"} size={2} />} 
          size="sm" 
          child={[
            {
              title: "Refer and Earn",
              value: "Refer and Earn",
              onClick: () => navigate("/refer"),
            },
            {
              title: 'Logout',
              value: 'Logout',
              onClick: () => logout(),
            },
          ]} 
        />
      </div>

      {/* Main Content */}
      <div className="min-h-full">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <NavLink 
            onClick={() => setBottomText("My Links")} 
            to="/brand/links"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <RiAdvertisementLine className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Create Ad.</span>
          </NavLink>

          <NavLink 
            onClick={() => setBottomText("Dashboard")} 
            to="/brand/overview"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <LuLayoutDashboard className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Dashboard</span>
          </NavLink>

          <NavLink 
            onClick={() => setBottomText("Wallet")} 
            to="/brand/wallet"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <IoWalletOutline className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Wallet</span>
          </NavLink>

          <NavLink 
            onClick={() => setBottomText("Profile")} 
            to="/brand/profile"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <CgProfile className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Profile</span>
          </NavLink>

          <NavLink 
            onClick={() => setBottomText("Creator")} 
            to="/brand/creators"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <IoPeopleCircle className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Creator</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default CompanyBase;
