import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInfluencerId, getSocialdets } from "../../services/influencer/profile/profile";
import { URL } from "../../constants/URL";
import { useEffect, useState } from "react";
import influencerAuthStore from "../../store/company/influencerAuth";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBrandShopee } from "react-icons/tb";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RiLinksFill } from "react-icons/ri";
import Menu from "../../components/Menu/Menu";
import Avatar from "../../components/Avatar/Avatar";
import { USER_TYPE } from "../../constants/conts";
import { cn } from "../../lib/utils";

const InfluencerBase = () => {
  const { setInfluencerId } = influencerAuthStore();
  const [bottomText, setBottomText] = useState("Home");
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['INFLUENCER_ID'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { data: social } = useQuery({
    queryKey: ['INFLUENCER_SOCIAL_DETAILS'],
    queryFn: () => getSocialdets(URL.infuencerSocialGet),
  });

  useEffect(() => {
    if (data?.data?.length) {
      const id = (data?.data[0]?.id);
      setInfluencerId(id);
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
              title: "View Public Page",
              value: "View Public Page",
              onClick: () => window.open(`https://linksfam.com/creator/${social?.data?.data[0]?.username}`, "_blank"),
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
            onClick={() => setBottomText("Shop")} 
            to="/creator/home"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <RiLinksFill className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">My Shop</span>
          </NavLink>

          <NavLink 
            onClick={() => setBottomText("Products")} 
            to="/creator/products"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <MdOutlineShoppingBag className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Products</span>
          </NavLink>

          <NavLink 
            onClick={() => setBottomText("Socials")} 
            to="/creator/socials"
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 min-w-0 flex-1",
              isActive 
                ? "text-primary bg-primary-lighten" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <TbBrandShopee className="text-xl mb-1" />
            <span className="text-xs font-medium truncate">Socials</span>
          </NavLink>

          <div 
            className="flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-0 flex-1 opacity-50 cursor-not-allowed"
            title="Coming Soon"
          >
            <LuLayoutDashboard className="text-xl mb-1 text-gray-400" />
            <span className="text-xs font-medium truncate text-gray-400">Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerBase;
