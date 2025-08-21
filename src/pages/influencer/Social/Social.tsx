import {  useMutation, useQuery } from '@tanstack/react-query';
import { BASEURL, URL } from '../../../constants/URL';
import YT from '../../../assets/images/youtube.png';
import {
  getInfluencerId,
  getInfluencerIgPage,
  // getInfluencerIgPage,
  getSocialdets,
  checkEligibility,
} from '../../../services/influencer/profile/profile';
import influencerAuthStore from '../../../store/company/influencerAuth';
import { useEffect, useState } from 'react';
import IG from '../../../assets/images/ig-C9PvHebc.png';
import Chip from '../../../components/Chip/Chip';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
// import { disconnectSocial } from '../../../services/influencer/shortlink/shortlink';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '../../../lib/utils';
// import ProfileCard from '../../../components/SocialProfileCard/SocialProfileCard';

interface SocialData {
  id: string;
  username?: string;
  profile_picture_url?: string;
  name?: string;
  followers_count?: number;
  follows_count?: number;
  token: string;
  socialMediaType: 'youtube' | 'instagram';
  media_count?: number;
  stories?: number;
  website?: string;
  biography?: string;
  isActive: boolean;
}

interface EligibilityResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    influencer: {
      id: number;
      name: string;
      is_yt_eligible: boolean;
      is_insta_eligible: boolean;
      updatedAt: string;
    };
    eligibilityChecks: {
      youtube: {
        connected: boolean;
        subscribersCheck: boolean;
        recentVideoCheck: boolean;
        subscriberCount: number;
        recentVideosCount: number;
        eligible: boolean;
        error: string | null;
      };
      instagram: {
        connected: boolean;
        followersCheck: boolean;
        recentPostCheck: boolean;
        followerCount: number;
        recentPostsCount: number;
        eligible: boolean;
        error: string | null;
      };
    };
    summary: {
      youtubeEligible: boolean;
      instagramEligible: boolean;
      overallEligible: boolean;
      connectedPlatforms: string[];
      eligiblePlatforms: string[];
    };
  } | null;
}

const InfluencerSocials = () => {
  const { setInfluencerId } = influencerAuthStore();
  const [_instagram, setInstagram] = useState(false);
  const [youtubeData, setYoutubeData] = useState<SocialData | null>(null);
  // const [instagramId, setInstagramId] = useState('');
  // const [youtubeId, setYoutubeId] = useState('');

  const navigate = useNavigate();

  const { data: _profile, refetch: refetchProfile } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { data: social } = useQuery({
    queryKey: ['INFLUENCER_SOCIAL_DETAILS'],
    queryFn: () => getSocialdets(URL.infuencerSocialGet),
  });
  const { data: ytVideos } = useQuery({
    queryKey: ['INFLUENCER_YT_VIDEOS'],
    queryFn: () => getSocialdets(URL.infuencerYTVideos),
  });

  console.log(ytVideos);

  const { data: igPosts } = useQuery({
    queryKey: ['INFLUENCER_IG_POSTS'],
    queryFn: () => getSocialdets(URL.getInstagramPosts()),
  });

  console.log(igPosts);

  const { data: igData, isLoading: isIgLoading } = useQuery({
    queryKey: ['INFLUENCER_IG'],
    queryFn: () => getInfluencerIgPage(URL.getInstagramPage()),
  });

  // const { mutate: disconnectAccount } = useMutation({
  //   mutationFn: (id: string) => disconnectSocial(URL.disconnectSocial(id)),
  // });

  const { mutate: checkEligibilityMutation, isPending: isCheckingEligibility } = useMutation<EligibilityResponse>({
    mutationFn: () => checkEligibility(URL.checkEligibility()),
    onSuccess: async (response) => {
      // Refetch the profile after eligibility check
      await refetchProfile();
      
      // Check if any platform is eligible and redirect based on API response structure
      if (response?.data?.summary?.overallEligible) {
        navigate('/creator/home');
      } else {
        // Show message if not eligible
        toast.error('Please check your account requirements.');
        // Optionally show a toast or alert to user
        if (response?.data?.summary) {
          const { youtubeEligible, instagramEligible } = response.data.summary;
          if (!youtubeEligible && !instagramEligible) {
            toast.error('Neither YouTube nor Instagram accounts meet the eligibility criteria.');
          }
        }
      }
    },
    onError: (_error) => {
      toast.error('Eligibility check failed');
    }
  });

  const handleYoutubeConnect = () => {
    window.location.href = `${BASEURL}/social/yt/connect?token=${localStorage.getItem('token')}`;
  };

  const handleInstagramConnect = () => {
    window.location.href =
      'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1355984448995226&redirect_uri=https://backend.linksfam.com/api/v1/social/connect/ig&response_type=code&scope=instagram_business_basic';
  };

  useEffect(() => {
    if (_profile?.data?.[0]?.id) {
      setInfluencerId(_profile.data[0].id);
    }
  }, [_profile]);

  useEffect(() => {
    if (social?.data?.data) {
      const socialData = social.data.data;
      const igAccount = socialData.find((item: SocialData) => item.socialMediaType === 'instagram');
      const ytAccount = socialData.find((item: SocialData) => item.socialMediaType === 'youtube');

      setInstagram(igAccount?.isActive || false);
      // setInstagramId(igAccount?.id || '');
      setYoutubeData(ytAccount || null);
    }
  }, [social]);

  // Refetch influencer profile when IG posts are successfully fetched
  useEffect(() => {
    if (igPosts?.data) {
      refetchProfile();
    }
  }, [igPosts, refetchProfile]);

  // useEffect(() => {
  //   if (disconnectData?.data) {
  //     refetchSocialDetails();
  //   }
  // }, [disconnectData]);

  // Check if platforms meet minimum requirements


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Connect Your Social Accounts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect your social media accounts to unlock collaboration opportunities and start earning with brands.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* YouTube Card */}
          <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2",
            youtubeData?.username 
              ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" 
              : "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 hover:border-red-300"
          )}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={YT} 
                      alt="YouTube" 
                      className="w-12 h-12 rounded-xl shadow-lg"
                    />
                    {youtubeData?.username && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                        <svg className="w-2 h-2 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">YouTube</CardTitle>
                    {youtubeData?.username && (
                      <p className="text-sm text-gray-600 font-medium">@{youtubeData.username}</p>
                    )}
                  </div>
                </div>
                <Chip
                  title={youtubeData?.username ? 'Connected' : 'Connect'}
                  variant={youtubeData?.username ? 'success' : 'secondary'}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {youtubeData?.username ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subscribers</span>
                    <span className="font-semibold text-gray-900">
                      {youtubeData.followers_count?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  {/* <Button
                    onClick={() => navigate('/creator/me')}
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  >
                    View Profile
                  </Button> */}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Connect your YouTube channel to start earning from video collaborations
                  </p>
                  <Button
                    onClick={handleYoutubeConnect}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Connect YouTube
                  </Button>
                </div>
              )}
              {youtubeData?.followers_count !== undefined && youtubeData.followers_count < 500 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Minimum 500 subscribers required for eligibility
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instagram Card */}
          {isIgLoading ? (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={IG} 
                        alt="Instagram" 
                        className="w-12 h-12 rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Instagram</CardTitle>
                      <p className="text-sm text-gray-600">Loading...</p>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={cn(
              "group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2",
              igData?.data?.username 
                ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" 
                : "border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-300"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={IG} 
                        alt="Instagram" 
                        className="w-12 h-12 rounded-xl shadow-lg"
                      />
                      {igData?.data?.username && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                          <svg className="w-2 h-2 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Instagram</CardTitle>
                      {igData?.data?.username && (
                        <p className="text-sm text-gray-600 font-medium">@{igData.data.username}</p>
                      )}
                    </div>
                  </div>
                  <Chip
                    title={igData?.data?.username ? 'Connected' : 'Connect'}
                    variant={igData?.data?.username ? 'success' : 'secondary'}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {igData?.data?.username ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Followers</span>
                      <span className="font-semibold text-gray-900">
                        {igData.data.followers_count?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    {/* <Button
                      onClick={() => disconnectAccount(instagramId)}
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Disconnect Account
                    </Button> */}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Connect your Instagram account to start earning from post collaborations
                    </p>
                    <Button
                      onClick={handleInstagramConnect}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Connect Instagram
                    </Button>
                  </div>
                )}
                {igData?.data?.followers_count !== undefined && igData.data.followers_count < 2000 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Minimum 2,000 followers required for eligibility
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Next Button */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-4">
            <Button
              onClick={() => checkEligibilityMutation()}
              disabled={isCheckingEligibility}
              size="lg"
              className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isCheckingEligibility ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking Eligibility...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Continue to Dashboard</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </Button>
            <p className="text-sm text-gray-500 max-w-md">
              We'll verify your account requirements and set up your creator dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerSocials;