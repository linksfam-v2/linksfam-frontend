import Logo from "../../../assets/images/Logo.svg";
import { SwipeableButton } from "react-swipeable-button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { USER_TYPE } from "../../../constants/conts";
import { Building2, ArrowRight, Users, TrendingUp, Zap, Shield } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage?.getItem("token");
    const type = localStorage?.getItem("type");
    if (token && type === USER_TYPE.COMPAMY) {
      navigate("/brand/links");
    } else if (token && type === USER_TYPE.INFLUENCER) {
      navigate("/creator/overview/");
    } else {
      // What comes as url
    }
  }, [localStorage?.getItem("token")])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/20 rounded-full translate-y-40 -translate-x-40"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-100/15 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-100/15 rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="text-purple-600" size={28} />
              <span className="text-xl font-bold text-gray-800">LinksFam</span>
            </div>
            <button 
              onClick={() => navigate('/brand/login')}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              <span>Brand Login</span>
              <ArrowRight size={16} />
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img src={Logo} alt="LinksFam" className="h-20 w-auto" />
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Brand Portal
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 mb-4 flex items-center justify-center flex-wrap gap-2">
                <span>Link</span>
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Collaborate</span>
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Grow</span>
              </p>
              
              <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                Connect with top creators, manage campaigns, and grow your brand with our powerful collaboration platform.
              </p>

              {/* CTA Swipe Button */}
              <div className="flex justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100">
                  <SwipeableButton
                    autoWidth={true}
                    onSuccess={() => navigate('/brand/login')}
                    text="Swipe to access Brand Portal" 
                    text_unlocked="Welcome to LinksFam!" 
                    background_color="#f8fafc"
                    sliderColor="#7c3aed"
                    borderRadius={50}
                  />
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Users className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Creator Network</h3>
                <p className="text-gray-600">Access thousands of verified creators across all major platforms and niches.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Campaign Analytics</h3>
                <p className="text-gray-600">Track performance, measure ROI, and optimize your influencer campaigns.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Setup</h3>
                <p className="text-gray-600">Launch campaigns in minutes with our streamlined collaboration tools.</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Trusted by Leading Brands</h2>
                <p className="text-purple-100">Join thousands of brands growing with LinksFam</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">10K+</div>
                  <div className="text-purple-100 text-sm">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-purple-100 text-sm">Partner Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">1M+</div>
                  <div className="text-purple-100 text-sm">Campaigns Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">4.9★</div>
                  <div className="text-purple-100 text-sm">Platform Rating</div>
                </div>
              </div>
            </div>

            {/* Security Banner */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="text-green-600 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">Enterprise-Grade Security</h3>
              </div>
              <p className="text-gray-600">Your campaigns and data are protected with bank-level security and compliance.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home;