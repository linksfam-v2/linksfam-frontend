import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { URL } from "../../constants/URL";
import { useEffect } from "react";
import { getInfluencerId } from "../../services/influencer/profile/profile";
import influencerAuthStore from "../../store/company/influencerAuth";
import Avatar from "../../components/Avatar/Avatar";
import Menu from "../../components/Menu/Menu";
import { USER_TYPE } from "../../constants/conts";

const PartnerBase = () => {

  const { setInfluencerId } = influencerAuthStore();

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['INFLUENCER_ID'], // Wrap the key in an array
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),  // The function to fetch data  // The function to fetch data
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
    <div className="">
      <div className="">
        LinksFam Partner
        <div className="">
          {/* <a href="javascript:void(Tawk_API.toggle())"><img src={Support} alt="Support" /></a> */}
          <Menu title={<Avatar name={data?.data[0]?.name ?? "P"} size={2} />} size="sm" child={[
            {
              title: "LinksFam",
              value: "Back to LinksFam",
              onClick: () => navigate("/"),
            },
            {
              title: 'Logout',
              value: 'Logout',
              onClick: () => logout(),
            },
          ]} />
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default PartnerBase;
