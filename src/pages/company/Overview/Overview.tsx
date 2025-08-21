import { useMutation, useQuery } from "@tanstack/react-query";
import Chip from "../../../components/Chip/Chip";
import { getAnalytics, getViews } from "../../../services/company/analytics/analytics";
import authStore from "../../../store/company/auth";
import { useEffect, useState } from "react";
import Bounce from "../../../assets/images/Bounce.svg";
import ReactApexChart from "react-apexcharts";
import { URL } from "../../../constants/URL";
import { getWalletBalance } from "../../../services/company/wallet/wallet";
import { 
  TrendingUp, 
  Eye, 
  DollarSign, 
  BarChart3, 
  Calendar,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const CompanyOverview = () => {

  const { companyId } = authStore();

  const [filter, setFilter] = useState("7days");

  const [isLoading, setIsLoading] = useState(true);

  const { data: wallet } = useQuery({
    queryKey: ['GET_WALLET'],
    queryFn: () => getWalletBalance(URL.getWalletCurrentBalance(companyId)),
    enabled: Boolean(companyId)
  });


  const [chartOptions, setChatOptions] = useState<any>({
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      background: 'transparent',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      type: "datetime",
      categories: [],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      theme: 'light',
    },
    colors: ["#8b5cf6", "#06b6d4"],
    fill: {
      type: "gradient",
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: ["#c084fc", "#67e8f9"],
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.05,
        stops: [50, 0, 100]
      },
    },
    grid: {
      show: true,
      borderColor: '#e5e7eb',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },   
      yaxis: {
        lines: {
          show: true
        }
      },  
    },
  });

  const [chartSeries, setChartSeris] = useState<any>([]);

  useEffect(() => {
    setIsLoading(true);
    if (companyId) {
      mutate({ filter, companyId });
      viewsMutate({ filter, companyId })
    }
  }, [companyId, filter])

  const { mutate, data: analytics } = useMutation({
    mutationFn: ({ filter, companyId }: { companyId: string, filter: string }) => getAnalytics({ filter, companyId })
  });


  const { mutate: viewsMutate, data: graph } = useMutation({
    mutationFn: ({ filter, companyId }: { companyId: string, filter: string }) => getViews({ filter, companyId })
  });

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
        { name: "Amount", data: yAmount, type: "line", yAxisIndex: 1 },
      ];
      setChartSeris(finalSeries);

      setChatOptions((prev: any) => ({
        ...prev,
        yaxis: [
          {
            title: {
              text: "Views",
              style: {
                color: '#6b7280',
                fontSize: '12px',
              },
            },
            labels: {
              formatter: (val: any) => val.toFixed(0),
              style: {
                colors: '#6b7280',
                fontSize: '11px',
              },
            },
          },
          {
            opposite: true,
            title: {
              text: "Amount",
              style: {
                color: '#6b7280',
                fontSize: '12px',
              },
            },
            labels: {
              formatter: (val: any) => `₹${val.toFixed(2)}`,
              style: {
                colors: '#6b7280',
                fontSize: '11px',
              },
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

  useEffect(() => {
    if (analytics?.data)
      setIsLoading(false);
  }, [analytics]);

  // Loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <img src={Bounce} alt="LinksFam" className="h-16 w-auto mx-auto mb-4" />
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const walletBalance = wallet?.data?.length ? Number(wallet?.data[0]?.walletBalance) : 0;
  const totalSpend = analytics?.data?.totalAmount || 0;
  const totalViews = analytics?.data?.views || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Overview</h1>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Wallet size={16} />
                  <span className="text-sm">
                    Current Balance: <span className="font-semibold text-green-600">₹{walletBalance.toFixed(2)}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-100">
                <Calendar size={16} className="text-gray-500 ml-2" />
                <div className="flex space-x-1">
                  <Chip 
                    size="small" 
                    title="7 Days" 
                    onClick={() => setFilter("7days")} 
                    variant={filter === "7days" ? 'secondary' : 'ternary'} 
                  />
                  <Chip 
                    size="small" 
                    onClick={() => setFilter("30days")} 
                    title="1 Month" 
                    variant={filter === "30days" ? 'secondary' : 'ternary'} 
                  />
                  <Chip 
                    size="small" 
                    onClick={() => setFilter("90days")} 
                    title="3 Months" 
                    variant={filter === "90days" ? 'secondary' : 'ternary'} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Spend Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                    <DollarSign className="text-red-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Spend</p>
                    <h3 className="text-2xl font-bold text-gray-800">₹{totalSpend.toFixed(2)}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-red-600">
                  <ArrowDownRight size={16} />
                  <span className="text-xs font-medium">Expense</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Your total spending for the selected period</p>
            </div>

            {/* Total Views Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Eye className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Views</p>
                    <h3 className="text-2xl font-bold text-gray-800">{totalViews.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <ArrowUpRight size={16} />
                  <span className="text-xs font-medium">Reach</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Total views generated in the selected period</p>
            </div>

            {/* Performance Metric */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Activity className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cost per View</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      ₹{totalViews > 0 ? (totalSpend / totalViews).toFixed(4) : '0.00'}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-xs font-medium">Efficiency</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Average cost per view generated</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-purple-600" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Performance Analytics</h2>
                  <p className="text-sm text-gray-600">Views and spending trends over time</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <ReactApexChart
                  key={filter}
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height={350}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-1">Need more reach?</h3>
              <p className="text-purple-100 text-sm mb-3">Launch a new campaign with top creators</p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Start Campaign
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-1">Top up wallet</h3>
              <p className="text-green-100 text-sm mb-3">Add funds to continue your campaigns</p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Add Funds
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-1">View Reports</h3>
              <p className="text-orange-100 text-sm mb-3">Download detailed analytics reports</p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyOverview
