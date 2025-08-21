import { useMutation, useQuery } from "@tanstack/react-query";
import Card, { ConversionStatsCard } from "../../../components/Card/Card";
import Chip from "../../../components/Chip/Chip";
import { useEffect, useState } from "react";
import Bounce from "../../../assets/images/Bounce.svg";
// CSS imports removed - using Tailwind instead

import ReactApexChart from "react-apexcharts";
import { geInftViews, getInfAnalytics } from "../../../services/influencer/analytics/analytics";
import influencerAuthStore from "../../../store/company/influencerAuth";
import { URL } from "../../../constants/URL";
import { getInfluencerWalletBalance } from "../../../services/influencer/wallet/wallet";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { getInfluencerId } from "../../../services/influencer/profile/profile";
import InfluencerSocials from "../Social/Social";
const InfluencerOverview = () => {

  const { influencerId } = influencerAuthStore();

  const [filter, setFilter] = useState("7days");

  const [isLoading, setIsLoading] = useState(true);

  const { data: _profile } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { data: wallet } = useQuery({
    queryKey: ['GET_INFLUENCER_WALLET'],
    queryFn: () => getInfluencerWalletBalance(URL.getInfluencerWalletValue(influencerId)),
    enabled: Boolean(influencerId),
  })

  const [chartOptions, setChatOptions] = useState<any>({
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        tools: {
          download: false, // Hides the download button
          selection: false, // Hides the selection tool
          zoom: false, // Hides the zoom tool
          zoomin: false, // Hides the zoom-in button
          zoomout: false, // Hides the zoom-out button
          pan: false, // Hides the pan button
          reset: false, // Hides the reset button (home icon)
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth", // Makes the area curve smooth
    },
    xaxis: {
      type: "datetime",
      categories: [
      ], // Example categories (dates)
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    colors: ["#344BFD", "#ff6b57"], // Area fill color
    fill: {
      type: "solid",
    },
  });

  const [chartSeries, setChartSeris] = useState<any>([]);


  useEffect(() => {
    setIsLoading(true);
    if (influencerId) {
      mutate({ filter, influencerId });
      viewsMutate({ filter, influencerId })
    }
  }, [influencerId, filter])

  const { mutate, data: analytics } = useMutation({
    mutationFn: ({ filter, influencerId }: { influencerId: string, filter: string }) => getInfAnalytics({ filter, influencerId })
  });


  const { mutate: viewsMutate, data: graph } = useMutation({
    mutationFn: ({ filter, influencerId }: { influencerId: string, filter: string }) => geInftViews({ filter, influencerId })
  });

  useEffect(() => {
    if (analytics?.data)
      setIsLoading(false);
  }, [analytics]);

  useEffect(() => {
    const dateobj = (graph?.data?.dateMap);
    const xAxis: any = []; const yViews = []; const yAmount = [];
    if (dateobj) {
      for (let temp in dateobj) {
        xAxis.push(temp);
        yViews.push(dateobj[temp].views);
        yAmount.push(dateobj[temp].amount);
      }
      const finalSeries = [
        { name: "Views", data: yViews, type: "line" },
        { name: "Earnings", data: yAmount, type: "line", yAxisIndex: 1 }, // Link to the secondary axis
      ];
      setChartSeris(finalSeries);

      setChatOptions((prev: any) => ({
        ...prev,
        yaxis: [
          {
            title: {
              text: "Views",
            },
            labels: {
              formatter: (val: any) => val.toFixed(0), // Format labels for Views
            },
          },
          {
            opposite: true, // Display on the right side
            title: {
              text: "Earnings",
            },
            labels: {
              formatter: (val: any) => `₹${val.toFixed(2)}`, // Format labels for Amount
            },
          },
        ],
        xaxis: {
          ...prev.xaxis,
          categories: xAxis,
        },
      }));

    }
  }, [graph, filter]);

  if(_profile?.data[0]?.is_yt_eligible === false && _profile?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }


  if (isLoading) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }

  return (
    <div className="">
      <div className="">
        <p className="">Account Overview</p>
        <span>Last Balance: &#8377;{wallet?.data?.length && Number(wallet?.data[0]?.walletBalance)?.toFixed(2)}</span>
        <div className="">
          <Chip size="medium" title="Last 7 Days" onClick={() => setFilter("7days")} variant={filter === "7days" ? 'secondary' : 'ternary'} />
          <Chip size="medium" onClick={() => setFilter("30days")} title="1 month" variant={filter === "30days" ? 'secondary' : 'ternary'} />
          <Chip size="medium" onClick={() => setFilter("90days")} title="3 month" variant={filter === "90days" ? 'secondary' : 'ternary'} />
          {/* <Chip size="medium" onClick={() => setShowDatePicker(!showDatePicker)} title="Custom" variant={filter === "custom" ? 'secondary' : 'ternary'} /> */}

        </div>
        <div className="">
          <Card
            chip="SPEND"
            title="Total Earnings"
            supportext="Your total earnings for the selected data range"
            subtitle={'Rs ' + Number(analytics?.data?.totalAmount)?.toFixed(2) + "/-" || 0?.toString()}
            subtitleColor
          />
          <br />
          <Card
            chip="VIEWS"
            title="Total Views"
            subtitle={analytics?.data?.views}
            supportext="Your total views for the selected data range"
          />
          <ConversionStatsCard />

        </div>
        <div className="">
          <div className="">
            <p className="">Views/Earnings Graph</p>
            <Link to="/creator/table/overview/">Earnings/Link <FaArrowRight /></Link>
          </div>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={350}
            key={filter}
          />
        </div>
      </div>
    </div>
  )
}

export default InfluencerOverview
