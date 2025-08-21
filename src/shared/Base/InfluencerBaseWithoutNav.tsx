import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { URL } from "../../constants/URL";
import { useEffect } from "react";
import { getInfluencerId } from "../../services/influencer/profile/profile";
import influencerAuthStore from "../../store/company/influencerAuth";

const InfluencerBaseWithoutNav = () => {

  const { setInfluencerId } = influencerAuthStore();

  const { data } = useQuery({
    queryKey: ['INFLUENCER_ID'], // Wrap the key in an array
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),  // The function to fetch data  // The function to fetch data
  });

  useEffect(() => {
    if (data?.data?.length) {
      const id = (data?.data[0]?.id);
      setInfluencerId(id);
    }
  }, [data?.data])

  return (
    <div className="">
      <Outlet />
    </div>
  )
}

export default InfluencerBaseWithoutNav;
