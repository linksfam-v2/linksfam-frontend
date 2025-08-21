import { useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { getInfluencerTable } from "../../../services/influencer/wallet/wallet";
import influencerAuthStore from "../../../store/company/influencerAuth";
import Bounce from "../../../assets/images/Bounce.svg";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import DownloadCSV from "../../../components/DownloadCSV/DownloadCSV";

type TypeTableIncome = {
  amount: number;
  link: string;
  short: string;
  views: number;
}

const TableOverview = () => {

  const { influencerId } = influencerAuthStore();

  const { data: table, isLoading } = useQuery({
    queryKey: ['GET_TABLE_ANALYTICS'],
    queryFn: () => getInfluencerTable(URL.getTableAnalytics(influencerId)),
  });

  if (isLoading) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }


  return (
    <div className="">
      <p className="">
        <Link to="/creator/overview/" className="">
          <FaArrowLeft />
        </Link>
        <DownloadCSV data={table?.data?.table} />
      </p>
      <div className="">
        {
          table?.data?.table.length > 0 ? table?.data?.table.map((item: TypeTableIncome, index: number) => {
            return (
              <div key={index} className="">
                <div className="">
                  <a target="_blank" href={item?.link}>Original Link</a>
                  <p>Views: &nbsp;<span>{item?.views}</span></p>
                </div>
                <div className="">
                  <a href={'#'}>{'https://s.linksfam.com/' + item?.short}</a>
                  <p><span>&#8377; {item?.amount.toFixed(2)}/-</span></p>
                </div>
              </div>
            )
          }):<p className="NotFound">No data Found</p>
        }
      </div>
    </div>
  )
}

export default TableOverview
