import { Instagram, Search, Video, Youtube, Share2, Image, ExternalLink, Edit2, CreditCard, IndianRupee } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { URL, HTTP_METHOD } from "../../../constants/URL";
import { getInfluencerId, getSocialdets, updateSocialWebsite } from "../../../services/influencer/profile/profile";
import { getProducts, Product } from "../../../services/influencer/products/products";
import { getRateCard, createRateCard, updateRateCard, RateCardData } from "../../../services/influencer/rate-card/rate-card";
import InfluencerSocials from "../Social/Social";
import Modal from "../../../components/Modal/Modal";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { toast } from "react-toastify";



// Types
interface User {
  id: string;
  email: string;
  // Add other user fields as needed
}

interface Influencer {
  id: string;
  name: string;
  city?: string;
  ig_url?: string;
  yt_url?: string;
  amazon_tag?: string;
  is_yt_eligible: boolean;
  is_insta_eligible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  // Add other category fields as needed
}

interface SocialDetails {
  instagramDetails: {
    id: string;
    socialMediaType: string;
    name?: string;
    username?: string;
    biography?: string;
    followersCount?: number;
    followsCount?: number;
    mediaCount?: number;
    profilePictureUrl?: string;
    website?: string;
    isActive: boolean;
    provider?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  youtubeDetails: {
    id: string;
    socialMediaType: string;
    name?: string;
    username?: string;
    biography?: string;
    followersCount?: number;
    followsCount?: number;
    mediaCount?: number;
    profilePictureUrl?: string;
    website?: string;
    isActive: boolean;
    provider?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  activePlatform: string;
  connectedPlatforms: string[];
}


interface Post {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  publishedAt: Date;
  engagement: {
    likes: number;
    comments: number;
    views?: number;
  };
  platform: 'youtube' | 'instagram';
  postType: string;
}
interface Pagination {
  skip: number;
  limit: number;
  total: number;
  returned: number;
  hasMore: boolean;
  nextSkip: number | null;
}

interface Stats {
  totalSocialPosts: number;
  activePlatform: string;
  totalEngagement: number;
  connectedPlatformsCount: number;
}

interface ProfileData {
  user: User;
  influencer: Influencer;
  category: Category;
  socialDetails: SocialDetails;
  posts: Post[];
  pagination: Pagination;
  stats: Stats;
}


interface ProfileResponse {
  data: ProfileData;
}

// API functions
const fetchProfileData = async (userId: string, skip: number = 0, limit: number = 10): Promise<ProfileResponse> => {
  const baseUrl = URL.getPublicProfileWithPosts(userId);
  const urlWithParams = `${baseUrl}?skip=${skip}&limit=${limit}`;
  
  const response = await fetch(urlWithParams, {
    method: HTTP_METHOD.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch profile data: ${response.statusText}`);
  }
  
  return response.json();
};



// Skeleton components for better loading experience
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-primary to-purple-600 p-6 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="h-6 w-24 bg-white/30 rounded-lg"></div>
          <div className="h-10 w-10 bg-white/30 rounded-full"></div>
        </div>
      </div>
      
      {/* Profile Card Skeleton */}
      <div className="px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
              <div className="h-4 bg-blue-200 rounded mb-2"></div>
              <div className="h-6 bg-blue-300 rounded"></div>
            </div>
            <div className="h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
              <div className="h-4 bg-purple-200 rounded mb-2"></div>
              <div className="h-6 bg-purple-300 rounded"></div>
            </div>
          </div>
          
          {/* Tabs Skeleton */}
          <div className="flex space-x-2 mb-6 bg-gray-100 rounded-xl p-2">
            <div className="h-10 bg-white rounded-lg flex-1 shadow-sm"></div>
            <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl"></div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-150 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

function ProfileContent() {
  const navigate = useNavigate();
  
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'products' | 'ratecard'>('videos');
  const [skip, setSkip] = useState(0);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [productsSkip, setProductsSkip] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // Website update modal state
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [websiteInput, setWebsiteInput] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  
  // Rate card modal state
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
  const [rateCardData, setRateCardData] = useState<RateCardData>({});
  const [rateCardErrors, setRateCardErrors] = useState<{[key: string]: string}>({});
  
  const queryClient = useQueryClient();

  // Website update mutation
  const updateWebsiteMutation = useMutation({
    mutationFn: updateSocialWebsite,
    onSuccess: () => {
      // Refresh social details data
      queryClient.invalidateQueries({ queryKey: ['INFLUENCER_SOCIAL_DETAILS'] });
      setIsWebsiteModalOpen(false);
      setWebsiteInput('');
      setWebsiteError('');
      // You can add a toast notification here
      //alert('Website updated successfully!');
      toast.success('link updated successfully!');
    },
    onError: (error: Error) => {
      setWebsiteError(error.message);
    },
  });

  // URL validation function
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (will remove website)
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
    // If it starts with http/https, validate as full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return urlPattern.test(url);
    }
    
    // Otherwise validate as domain
    return domainPattern.test(url) || urlPattern.test(`https://${url}`);
  };

  // Handler functions
  const handleOpenWebsiteModal = () => {
    setWebsiteInput(primarySocial?.website || '');
    setWebsiteError('');
    setIsWebsiteModalOpen(true);
  };

  const handleWebsiteSubmit = () => {
    const trimmedInput = websiteInput.trim();
    
    // Validate URL
    if (!validateUrl(trimmedInput)) {
      setWebsiteError('Please enter a valid website URL (e.g., example.com or https://example.com)');
      return;
    }
    
    // Determine social media type based on primary social
    const socialMediaType = primarySocial?.socialMediaType || 'instagram';
    
    // Prepare website value (null for empty, add https if needed)
    let websiteValue: string | null = null;
    if (trimmedInput) {
      websiteValue = trimmedInput.startsWith('http') 
        ? trimmedInput 
        : `https://${trimmedInput}`;
    }
    
    updateWebsiteMutation.mutate({
      socialMediaType,
      website: websiteValue
    });
  };

  // Rate card handlers
  const handleOpenRateCardModal = () => {
    if (rateCard) {
      // Pre-populate with existing data for editing
      setRateCardData({
        reelCharge: rateCard.reelCharge,
        storyCharge: rateCard.storyCharge,
        carouselPostCharge: rateCard.carouselPostCharge,
        linkInBioCharge: rateCard.linkInBioCharge,
        instagramComboPackage: rateCard.instagramComboPackage,
        youtubeShortCharge: rateCard.youtubeShortCharge,
        youtubeIntegrationCharge: rateCard.youtubeIntegrationCharge,
        youtubeDedicatedVideoCharge: rateCard.youtubeDedicatedVideoCharge,
        customComboPackage: rateCard.customComboPackage,
        minimumCollaborationValue: rateCard.minimumCollaborationValue,
        availableForBarterDeals: rateCard.availableForBarterDeals,
      });
    } else {
      // Fresh form for creating new rate card
      setRateCardData({});
    }
    setRateCardErrors({});
    setIsRateCardModalOpen(true);
  };

  const handleRateCardChange = (field: keyof RateCardData, value: any) => {
    setRateCardData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (rateCardErrors[field]) {
      setRateCardErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateRateCardData = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validate numeric fields
    const numericFields = [
      'reelCharge', 'storyCharge', 'carouselPostCharge', 'linkInBioCharge',
      'instagramComboPackage', 'youtubeShortCharge', 'youtubeIntegrationCharge',
      'youtubeDedicatedVideoCharge', 'minimumCollaborationValue'
    ];
    
    numericFields.forEach(field => {
      const value = rateCardData[field as keyof RateCardData];
      if (value !== undefined && value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
        errors[field] = 'Must be a valid positive number';
      }
    });
    
    // Validate custom combo package length
    if (rateCardData.customComboPackage && rateCardData.customComboPackage.length > 1000) {
      errors.customComboPackage = 'Maximum 1000 characters allowed';
    }
    
    setRateCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRateCardSubmit = () => {
    if (!validateRateCardData()) {
      return;
    }
    
    // Convert empty strings to undefined and numbers to actual numbers
    const sanitizedData: RateCardData = {};
    Object.entries(rateCardData).forEach(([key, value]) => {
      if (value === '' || value === null) {
        sanitizedData[key as keyof RateCardData] = undefined;
      } else if (typeof value === 'string' && key !== 'customComboPackage' && key !== 'availableForBarterDeals') {
        const numValue = Number(value);
        sanitizedData[key as keyof RateCardData] = isNaN(numValue) ? undefined : numValue as any;
      } else {
        sanitizedData[key as keyof RateCardData] = value as any;
      }
    });
    
    if (rateCard) {
      updateRateCardMutation.mutate(sanitizedData);
    } else {
      createRateCardMutation.mutate(sanitizedData);
    }
  };

  const { data: _profile, isLoading: profileLoading } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  // Check if user has completed profile creation
  useEffect(() => {
    if (!profileLoading && _profile?.data) {
      // Check if profile exists but is incomplete (no name)
      if (_profile.data.length === 0 || !_profile.data[0]?.name) {
        // User doesn't have a completed profile, redirect to profile creation
        navigate('/creator/create');
      }
    }
  }, [_profile, profileLoading, navigate]);

  const { data: igPosts } = useQuery({
    queryKey: ['INFLUENCER_IG_POSTS'],
    queryFn: () => getSocialdets(URL.getInstagramPosts()),
  });

  console.log(igPosts);

  const { data: social } = useQuery({
    queryKey: ['INFLUENCER_SOCIAL_DETAILS'],
    queryFn: () => getSocialdets(URL.infuencerSocialGet),
  });

  // Extract username from social details for profile query
  const username = useMemo(() => {
    if (!social?.data?.data) return '';
    const socialData = social.data.data;
    const activeAccount = socialData.find((item: any) => item.isActive);
    return activeAccount?.username || socialData[0]?.username || '';
  }, [social?.data?.data]);

  // TanStack Query for profile data
  const { data: profileData, isLoading: loading, error } = useQuery({
    queryKey: ['profile', username, skip],
    queryFn: () => fetchProfileData(username, skip, 10),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // TanStack Query for products data
  const influencerId = _profile?.data?.[0]?.id;
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', influencerId, productsSkip],
    queryFn: () => getProducts(influencerId, productsSkip, 10),
    enabled: activeTab === 'products' && !!influencerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // TanStack Query for rate card data
  const { data: rateCardResponse, isLoading: rateCardLoading } = useQuery({
    queryKey: ['rateCard', influencerId],
    queryFn: () => getRateCard(influencerId),
    enabled: activeTab === 'ratecard' && !!influencerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Extract rate card data
  const rateCard = rateCardResponse?.data?.rateCard;
  
  // Rate card mutations
  const createRateCardMutation = useMutation({
    mutationFn: createRateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateCard', influencerId] });
      setIsRateCardModalOpen(false);
      setRateCardData({});
      setRateCardErrors({});
      toast.success('Rate card created successfully!');
    },
    onError: (error: Error) => {
      setRateCardErrors({ general: error.message });
    },
  });
  
  const updateRateCardMutation = useMutation({
    mutationFn: updateRateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateCard', influencerId] });
      setIsRateCardModalOpen(false);
      setRateCardData({});
      setRateCardErrors({});
      toast.success('Rate card updated successfully!');
    },
    onError: (error: Error) => {
      setRateCardErrors({ general: error.message });
    },
  });

  // Update posts when profileData changes
  useEffect(() => {
    if (profileData?.data.posts) {
      if (skip === 0) {
        setAllPosts(profileData.data.posts);
      } else {
        setAllPosts(prev => [...prev, ...profileData.data.posts]);
      }
    }
  }, [profileData?.data.posts, skip]);

  // Update products when productsData changes
  useEffect(() => {
    if (productsData?.data.products) {
      if (productsSkip === 0) {
        setAllProducts(productsData.data.products);
      } else {
        setAllProducts(prev => [...prev, ...productsData.data.products]);
      }
    }
  }, [productsData?.data.products, productsSkip]);

  // Extract handle from social details API
  const handle = useMemo(() => {
    if (!social?.data?.data) return '';
    
    const socialData = social.data.data;
    const instagramAccount = socialData.find((item: any) => item.socialMediaType === 'instagram');
    const youtubeAccount = socialData.find((item: any) => item.socialMediaType === 'youtube');
    
    // Try to get handle from active platforms
    if (instagramAccount?.isActive && instagramAccount?.username) {
      return instagramAccount.username.replace('@', '');
    }
    
    if (youtubeAccount?.isActive && youtubeAccount?.username) {
      return youtubeAccount.username.replace('@', '');
    }
    
    // Fallback to any available username
    const instagramUsername = instagramAccount?.username?.replace('@', '');
    const youtubeUsername = youtubeAccount?.username?.replace('@', '');
    
    return instagramUsername || youtubeUsername || '';
  }, [social?.data?.data]);



  // Memoized calculations to prevent unnecessary re-renders using social details API
  const { primarySocial, instagramFollowers, youtubeSubscribers, hasInstagram, hasYoutube, bothPlatformsConnected, totalFollowers } = useMemo(() => {
    if (!social?.data?.data) return { 
      primarySocial: null, 
      instagramFollowers: 0, 
      youtubeSubscribers: 0,
      hasInstagram: false,
      hasYoutube: false,
      bothPlatformsConnected: false,
      totalFollowers: 0
    };
    
    const socialData = social.data.data;
    const instagramAccount = socialData.find((item: any) => item.socialMediaType === 'instagram');
    const youtubeAccount = socialData.find((item: any) => item.socialMediaType === 'youtube');
    
    // Determine primary social based on active platform or availability
    let primarySocial = null;
    if (instagramAccount?.isActive && youtubeAccount?.isActive) {
      // If both are active, prefer Instagram as primary
      primarySocial = instagramAccount;
    } else if (instagramAccount?.isActive) {
      primarySocial = instagramAccount;
    } else if (youtubeAccount?.isActive) {
      primarySocial = youtubeAccount;
    }

    const instagramFollowersCount = instagramAccount?.followers_count || 0;
    const youtubeSubscribersCount = youtubeAccount?.followers_count || 0;
    const bothConnected = !!instagramAccount?.isActive && !!youtubeAccount?.isActive;
    const total = instagramFollowersCount + youtubeSubscribersCount;
    
    return { 
      primarySocial,
      instagramFollowers: instagramFollowersCount,
      youtubeSubscribers: youtubeSubscribersCount,
      hasInstagram: !!instagramAccount?.isActive,
      hasYoutube: !!youtubeAccount?.isActive,
      bothPlatformsConnected: bothConnected,
      totalFollowers: total
    };
  }, [social?.data?.data]);

  // Function to handle video click
  const handleVideoClick = useCallback(async (post: Post) => {
    if (post?.id && handle) {
      const searchParams = new URLSearchParams({
        postId: post.id,
        platform: post.platform,
        mediaUrl: encodeURIComponent(post.mediaUrl || ''),
        thumbnailUrl: encodeURIComponent(post.thumbnailUrl || ''),
        title: post.title || '',
        description: post.description || '',
        publishedAt: post.publishedAt.toString(),
        likes: post.engagement?.likes?.toString() || '0',
        comments: post.engagement?.comments?.toString() || '0',
        views: post.engagement?.views?.toString() || '0',
        permalink: encodeURIComponent(post.permalink || '')
      });
      // Only open in new window for videos/reels, photos can be viewed inline or not opened
      if(post.postType.toLowerCase() !== 'video' && post.postType.toLowerCase() !== 'reel'){
        return;
      }
      
      window.open(`https://linksfam.com/creator/${handle}/reels?${searchParams.toString()}`, '_blank');
    }
  }, [handle]);

  // Format follower count
  const formatFollowerCount = useCallback((count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }, []);



  // Extract data that will be used in conditional rendering
  const { influencer } = profileData?.data || {};
  const hasMorePosts = profileData?.data?.pagination?.hasMore || false;
  const hasMoreProducts = productsData?.data?.pagination?.hasMore || false;

  // Determine if the active platform is YouTube
  const isYouTubePrimary = useMemo(() => {
    if (!social?.data?.data) return false;
    
    const socialData = social.data.data;
    const instagramAccount = socialData.find((item: any) => item.socialMediaType === 'instagram');
    const youtubeAccount = socialData.find((item: any) => item.socialMediaType === 'youtube');
    
    // Check if YouTube is the primary active platform
    if (youtubeAccount?.isActive && instagramAccount?.isActive) {
      // If both are active, check which one provided the handle
      return youtubeAccount?.username?.replace('@', '') === handle;
    }
    
    return youtubeAccount?.isActive && youtubeAccount?.username?.replace('@', '') === handle;
  }, [social?.data?.data, handle]);

  // Handle share functionality
  const handleShare = useCallback(async () => {
    const formattedHandle = isYouTubePrimary ? `@${handle}` : handle;
    const shareUrl = `https://linksfam.com/creator/${formattedHandle}`;
    const shareData = {
      title: `Check out ${influencer?.name}'s profile on LinksFam`,
      text: `Discover ${influencer?.name}'s content and products on LinksFam`,
      url: shareUrl,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
        alert('Profile link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Profile link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        // Final fallback: show the URL
        prompt('Copy this link to share your profile:', shareUrl);
      }
    }
  }, [handle, influencer?.name, isYouTubePrimary]);

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === 'photos') {
      return allPosts.filter((post: Post) => 
        post.postType?.toLowerCase() === 'image' || post.postType?.toLowerCase() === 'carousel'
      );
    } else if (activeTab === 'videos') {
      return allPosts.filter((post: Post) => 
        post.postType?.toLowerCase() === 'video' || post.postType?.toLowerCase() === 'reel'
      );
    }
    return [];
  }, [allPosts, activeTab]);

  const loadMorePosts = () => {
    if (hasMorePosts) {
      setSkip(prev => prev + 10);
    }
  };

  const loadMoreProducts = () => {
    if (hasMoreProducts) {
      setProductsSkip(prev => prev + 10);
    }
  };

  // Handle all conditional rendering AFTER all hooks have been called
  if (loading) {
    return <ProfileSkeleton />;
  }

  if(_profile?.data[0]?.is_yt_eligible === false && _profile?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error: {error instanceof Error ? error.message : 'An error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 px-4 py-8 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Header content */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Creator Shop</h1>
            <p className="text-white/80 text-sm">Share your content & products</p>
          </div>
          <button
            onClick={handleShare}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            title="Share profile"
          >
            <Share2 size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-12 pb-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm">
          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              {/* Profile picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ring-4 ring-white shadow-lg">
                  {primarySocial?.profile_picture_url ? (
                    <img
                      src={primarySocial?.profile_picture_url}
                      alt={`${influencer?.name || 'User'}'s profile`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.log('Profile image failed to load:', primarySocial?.profile_picture_url);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.remove('from-blue-100', 'to-purple-100');
                          parent.classList.add('bg-gray-300');
                        }
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {influencer?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
              </div>

              {/* Name and handle */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{influencer?.name}</h2>
                <p className="text-gray-500 text-sm">@{handle}</p>
                <div className="flex items-center mt-2 space-x-3">
                  {hasYoutube && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-lg">
                      <Youtube size={14} className="text-red-600" />
                      <span className="text-xs font-medium text-red-700">YouTube</span>
                    </div>
                  )}
                  {hasInstagram && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-pink-50 rounded-lg">
                      <Instagram size={14} className="text-pink-600" />
                      <span className="text-xs font-medium text-pink-700">Instagram</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Total Followers - Shows when both platforms connected */}
              {bothPlatformsConnected && totalFollowers > 0 && (
                <div className="col-span-full">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-1">{formatFollowerCount(totalFollowers)}</h3>
                      <p className="text-white/80 text-sm font-medium">Total Followers</p>
                    </div>
                    <div className="flex justify-center space-x-8 mt-4 pt-4 border-t border-white/20">
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Youtube className="text-white" size={18} />
                        </div>
                        <div className="text-lg font-semibold">{formatFollowerCount(youtubeSubscribers)}</div>
                        <div className="text-white/70 text-xs">subscribers</div>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Instagram className="text-white" size={18} />
                        </div>
                        <div className="text-lg font-semibold">{formatFollowerCount(instagramFollowers)}</div>
                        <div className="text-white/70 text-xs">followers</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual platform cards - Shows when platforms aren't both connected */}
              {!bothPlatformsConnected && hasYoutube && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500 rounded-xl">
                      <Youtube className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{formatFollowerCount(youtubeSubscribers)}</div>
                      <div className="text-red-600 text-sm font-medium">Subscribers</div>
                    </div>
                  </div>
                </div>
              )}

              {!bothPlatformsConnected && hasInstagram && (
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                      <Instagram className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{formatFollowerCount(instagramFollowers)}</div>
                      <div className="text-pink-600 text-sm font-medium">Followers</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Post Card */}
              {/* <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <Video className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Last Post</div>
                    <div className="text-green-600 text-xs font-medium">
                      {mostRecentPost?.publishedAt
                        ? new Date(mostRecentPost.publishedAt).toLocaleDateString('en-GB')
                        : 'No posts yet'
                      }
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Bio */}
            {primarySocial?.biography && (
              <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
                <p className={`text-gray-700 leading-relaxed ${!bioExpanded && (primarySocial?.biography?.length || 0) > 100 ? 'line-clamp-3' : ''}`}>
                  {primarySocial?.biography}
                </p>
                {(primarySocial?.biography?.length || 0) > 100 && (
                  <button 
                    className="text-primary font-medium mt-2 hover:text-primary-hover transition-colors text-sm"
                    onClick={() => setBioExpanded(!bioExpanded)}
                  >
                    {bioExpanded ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}

            {/* Website */}
            <div className="mb-4">
              {primarySocial?.website && primarySocial.website.trim() !== '' ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <a 
                    href={primarySocial.website.startsWith('http') ? primarySocial.website : `https://${primarySocial.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors flex-1 min-w-0"
                  >
                    <ExternalLink size={16} />
                    <span className="truncate">{primarySocial.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </a>
                  <button
                    onClick={handleOpenWebsiteModal}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit website"
                  >
                    <Edit2 size={16} className="text-blue-500" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenWebsiteModal}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary-lighten transition-colors flex items-center justify-center space-x-2 text-gray-500 hover:text-primary"
                >
                  <ExternalLink size={16} />
                  <span>Add website</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-4 gap-1 mb-6 bg-gray-100 rounded-2xl p-2">
            <button
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm ${
                activeTab === 'photos' 
                  ? 'bg-white text-primary shadow-lg shadow-blue-100 scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('photos')}
            >
              <Image size={16} />
              <span>Photos</span>
            </button>
            <button
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm ${
                activeTab === 'videos' 
                  ? 'bg-white text-primary shadow-lg shadow-blue-100 scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('videos')}
            >
              <Video size={16} />
              <span>Videos</span>
            </button>
            <button
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm ${
                activeTab === 'products' 
                  ? 'bg-white text-primary shadow-lg shadow-blue-100 scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('products')}
            >
              <Search size={16} />
              <span>Products</span>
            </button>
            <button
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm ${
                activeTab === 'ratecard' 
                  ? 'bg-white text-primary shadow-lg shadow-blue-100 scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('ratecard')}
            >
              <CreditCard size={16} />
              <span>Rate Card</span>
            </button>
          </div>
          
          {/* Content Area */}
          {(activeTab === 'photos' || activeTab === 'videos') && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-1">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post: Post) => (
                    <div
                      key={post.id}
                      className="group bg-white overflow-hidden cursor-pointer relative"
                      onClick={() => handleVideoClick(post)}
                    >
                      {/* Post Image/Thumbnail */}
                      <div className="aspect-square w-full relative overflow-hidden">
                        {post?.thumbnailUrl || post?.mediaUrl ? (
                          <img
                            src={post?.thumbnailUrl || post?.mediaUrl}
                            alt={post?.title || 'Post thumbnail'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.log('Post image failed to load:', post?.thumbnailUrl || post?.mediaUrl);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.classList.add('bg-gray-100');
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Video size={24} className="text-gray-400" />
                          </div>
                        )}
                        
                        {/* Instagram-style overlay with engagement */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="flex items-center space-x-4 text-white">
                            <div className="flex items-center space-x-1">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                              <span className="font-semibold">{post.engagement?.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 6h-2l-1.27-1.27c-.39-.39-.9-.73-1.73-.73H8c-.83 0-1.34.34-1.73.73L5 6H3c-.55 0-1 .45-1 1s.45 1 1 1h1l1.83 9.18c.1.54.54.82 1.17.82h8c.63 0 1.07-.28 1.17-.82L17 8h1c.55 0 1-.45 1-1s-.45-1-1-1z"/>
                              </svg>
                              <span className="font-semibold">{post.engagement?.comments || 0}</span>
                            </div>
                            {post.engagement?.views && (
                              <div className="flex items-center space-x-1">
                                <Video size={20} />
                                <span className="font-semibold">{post.engagement.views}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Post type indicator */}
                      {activeTab === 'videos' && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 rounded-full p-1">
                            <Video size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                      
                      {post.postType?.toLowerCase() === 'carousel' && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                      {activeTab === 'photos' ? (
                        <Image size={48} className="mx-auto mb-4 text-gray-300" />
                      ) : (
                        <Video size={48} className="mx-auto mb-4 text-gray-300" />
                      )}
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        No {activeTab === 'photos' ? 'photos' : 'videos'} yet
                      </h3>
                      <p className="text-sm text-gray-400">
                        Your {activeTab === 'photos' ? 'photos' : 'videos'} will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Load More Posts Button */}
              {hasMorePosts && (
                <div className="text-center py-6">
                  <button
                    onClick={loadMorePosts}
                    className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:from-primary-hover hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-1">
                {productsLoading && allProducts.length === 0 ? (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse bg-white overflow-hidden">
                        <div className="aspect-square bg-gray-200"></div>
                      </div>
                    ))}
                  </>
                ) : allProducts.length > 0 ? (
                  <>
                    {allProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group bg-white overflow-hidden cursor-pointer relative"
                        onClick={() => product?.productUrl && window.open(product.productUrl, '_blank', 'noopener,noreferrer')}
                      >
                        {/* Product Image */}
                        <div className="aspect-square w-full relative overflow-hidden" id={`product-image-${product.id}`}>
                          <img
                            src={product?.imageUrl}
                            alt={product?.productName || 'Product image'}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                            crossOrigin="anonymous"
                            onError={(_e) => {
                              console.log('Product image failed to load:', product?.imageUrl);
                              const imageContainer = document.getElementById(`product-image-${product.id}`);
                              if (imageContainer) {
                                imageContainer.style.display = 'none';
                              }
                            }}
                          />
                          
                          {/* Product overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="flex items-center space-x-2 text-white">
                              <Search size={20} />
                              <span className="font-semibold">Shop</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product indicator */}
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 rounded-full p-1">
                            <Search size={16} className="text-white" />
                          </div>
                        </div>
                        
                        {/* Price indicator */}
                        {product?.price && (
                          <div className="absolute bottom-2 left-2">
                            <div className="bg-black/70 rounded-lg px-2 py-1">
                              <span className="text-white text-sm font-semibold">₹{product?.price}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Load More Products Button */}
                    {hasMoreProducts && (
                      <div className="col-span-full text-center py-6">
                        <button
                          onClick={loadMoreProducts}
                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                          disabled={productsLoading}
                        >
                          {productsLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Loading...</span>
                            </div>
                          ) : (
                            'Load More Products'
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Search size={32} className="text-green-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-500 mb-2">No products yet</h3>
                      <p className="text-sm text-gray-400">
                        Add products to showcase your recommendations
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'ratecard' && (
            <div className="space-y-4!">
              {rateCardLoading ? (
                <div className="flex! items-center! justify-center! py-8!">
                  <div className="animate-spin! w-8! h-8! border-4! border-blue-500! border-t-transparent! rounded-full!"></div>
                </div>
              ) : rateCard ? (
                <div className="bg-white! rounded-lg! shadow-sm! overflow-hidden!">
                  {/* Rate Card Header */}
                  <div className="bg-gradient-to-r! from-blue-500! to-purple-600! text-white! px-6! py-4!">
                    <div className="flex! items-center! justify-between!">
                      <div className="flex! items-center! gap-2!">
                        <CreditCard size={20} />
                        <h2 className="text-lg! font-semibold!">Rate Card</h2>
                      </div>
                      <button
                        onClick={handleOpenRateCardModal}
                        className="flex! items-center! gap-2! bg-white! hover:bg-gray-100! text-gray-800! px-3! py-1! rounded-md! transition-colors! text-sm! font-medium!"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Rate Card Content */}
                  <div className="p-6! space-y-6!">
                    {/* Instagram Section */}
                    {(rateCard.reelCharge || rateCard.storyCharge || rateCard.carouselPostCharge || rateCard.linkInBioCharge || rateCard.instagramComboPackage) && (
                      <div>
                        <div className="flex! items-center! gap-2! mb-3!">
                          <Instagram className="text-pink-600!" size={20} />
                          <h3 className="text-lg! font-semibold! text-gray-800!">Instagram</h3>
                        </div>
                        <div className="grid! grid-cols-2! gap-3!">
                          {rateCard.reelCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Reel</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.reelCharge}</span>
                            </div>
                          )}
                          {rateCard.storyCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Story</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.storyCharge}</span>
                            </div>
                          )}
                          {rateCard.carouselPostCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Carousel Post</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.carouselPostCharge}</span>
                            </div>
                          )}
                          {rateCard.linkInBioCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Link in Bio</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.linkInBioCharge}</span>
                            </div>
                          )}
                          {rateCard.instagramComboPackage && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg! col-span-2!">
                              <span className="text-sm! text-gray-600!">Combo Package</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.instagramComboPackage}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* YouTube Section */}
                    {(rateCard.youtubeShortCharge || rateCard.youtubeIntegrationCharge || rateCard.youtubeDedicatedVideoCharge) && (
                      <div>
                        <div className="flex! items-center! gap-2! mb-3!">
                          <Youtube className="text-red-600!" size={20} />
                          <h3 className="text-lg! font-semibold! text-gray-800!">YouTube</h3>
                        </div>
                        <div className="grid! grid-cols-2! gap-3!">
                          {rateCard.youtubeShortCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Short</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.youtubeShortCharge}</span>
                            </div>
                          )}
                          {rateCard.youtubeIntegrationCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Integration</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.youtubeIntegrationCharge}</span>
                            </div>
                          )}
                          {rateCard.youtubeDedicatedVideoCharge && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg! col-span-2!">
                              <span className="text-sm! text-gray-600!">Dedicated Video</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.youtubeDedicatedVideoCharge}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Custom & Other */}
                    {(rateCard.customComboPackage || rateCard.minimumCollaborationValue || rateCard.availableForBarterDeals !== undefined) && (
                      <div>
                        <div className="flex! items-center! gap-2! mb-3!">
                          <IndianRupee className="text-green-600!" size={20} />
                          <h3 className="text-lg! font-semibold! text-gray-800!">Other Details</h3>
                        </div>
                        <div className="space-y-3!">
                          {rateCard.customComboPackage && (
                            <div className="p-3! bg-gray-50! rounded-lg!">
                              <div className="text-sm! text-gray-600! mb-1!">Custom Package</div>
                              <div className="text-gray-800!">{rateCard.customComboPackage}</div>
                            </div>
                          )}
                          {rateCard.minimumCollaborationValue && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Minimum Collaboration Value</span>
                              <span className="font-semibold! text-gray-800!">₹{rateCard.minimumCollaborationValue}</span>
                            </div>
                          )}
                          {rateCard.availableForBarterDeals !== undefined && (
                            <div className="flex! items-center! justify-between! p-3! bg-gray-50! rounded-lg!">
                              <span className="text-sm! text-gray-600!">Available for Barter Deals</span>
                              <span className={`font-semibold! ${rateCard.availableForBarterDeals ? 'text-green-600!' : 'text-red-600!'}`}>
                                {rateCard.availableForBarterDeals ? 'Yes' : 'No'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center! py-8! bg-white! rounded-lg! shadow-sm!">
                  <div className="w-16! h-16! mx-auto! mb-4! bg-gray-100! rounded-full! flex! items-center! justify-center!">
                    <CreditCard size={24} className="text-gray-400!" />
                  </div>
                  <h3 className="text-lg! font-semibold! text-gray-800! mb-2!">No Rate Card Yet</h3>
                  <p className="text-gray-600! mb-4!">Create your rate card to showcase your pricing to brands</p>
                  <button
                    onClick={handleOpenRateCardModal}
                    className="inline-flex! items-center! gap-2! bg-blue-500! text-white! px-4! py-2! rounded-lg! hover:bg-blue-600! transition-colors!"
                  >
                    <CreditCard size={16} />
                    Create Rate Card
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Website Update Modal */}
      <Modal
        open={isWebsiteModalOpen}
        onClose={() => setIsWebsiteModalOpen(false)}
        title="Update Website"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <Input
              label="Website URL"
              placeholder="e.g., yourwebsite.com or https://yourwebsite.com"
              value={websiteInput}
              onChange={(e) => {
                setWebsiteInput(e.target.value);
                setWebsiteError('');
              }}
              isError={!!websiteError}
              hintText={websiteError}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to remove your website. You can enter just the domain (example.com) or a full URL.
            </p>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              title="Cancel"
              variant="danger"
              isOutlined
              onClick={() => setIsWebsiteModalOpen(false)}
              disabled={updateWebsiteMutation.isPending}
            />
            <Button
              title={updateWebsiteMutation.isPending ? "Updating..." : "Save"}
              onClick={handleWebsiteSubmit}
              disabled={updateWebsiteMutation.isPending}
              variant="primary"
            />
          </div>
        </div>
      </Modal>

      {/* Rate Card Modal */}
      <Modal
        open={isRateCardModalOpen}
        onClose={() => setIsRateCardModalOpen(false)}
        title={rateCard ? "Update Rate Card" : "Create Rate Card"}
        size="lg"
      >
        <div className="space-y-6! max-h-96! overflow-y-auto!">
          {/* General Error */}
          {rateCardErrors.general && (
            <div className="bg-red-50! border! border-red-200! rounded-lg! p-3!">
              <p className="text-red-600! text-sm!">{rateCardErrors.general}</p>
            </div>
          )}

          {/* Instagram Section */}
          <div>
            <div className="flex! items-center! gap-2! mb-3!">
              <Instagram className="text-pink-600!" size={20} />
              <h3 className="text-lg! font-semibold! text-gray-800!">Instagram</h3>
            </div>
            <div className="grid! grid-cols-2! gap-4!">
              <Input
                label="Reel (₹)"
                placeholder="e.g., 2000"
                value={rateCardData.reelCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('reelCharge', e.target.value)}
                isError={!!rateCardErrors.reelCharge}
                hintText={rateCardErrors.reelCharge}
              />
              <Input
                label="Story (₹)"
                placeholder="e.g., 800"
                value={rateCardData.storyCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('storyCharge', e.target.value)}
                isError={!!rateCardErrors.storyCharge}
                hintText={rateCardErrors.storyCharge}
              />
              <Input
                label="Carousel Post (₹)"
                placeholder="e.g., 1500"
                value={rateCardData.carouselPostCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('carouselPostCharge', e.target.value)}
                isError={!!rateCardErrors.carouselPostCharge}
                hintText={rateCardErrors.carouselPostCharge}
              />
              <Input
                label="Link in Bio (₹)"
                placeholder="e.g., 500"
                value={rateCardData.linkInBioCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('linkInBioCharge', e.target.value)}
                isError={!!rateCardErrors.linkInBioCharge}
                hintText={rateCardErrors.linkInBioCharge}
              />
              <Input
                label="Combo Package (₹)"
                placeholder="e.g., 3500"
                value={rateCardData.instagramComboPackage?.toString() || ''}
                onChange={(e) => handleRateCardChange('instagramComboPackage', e.target.value)}
                isError={!!rateCardErrors.instagramComboPackage}
                hintText={rateCardErrors.instagramComboPackage}
              />
            </div>
          </div>

          {/* YouTube Section */}
          <div>
            <div className="flex! items-center! gap-2! mb-3!">
              <Youtube className="text-red-600!" size={20} />
              <h3 className="text-lg! font-semibold! text-gray-800!">YouTube</h3>
            </div>
            <div className="grid! grid-cols-2! gap-4!">
              <Input
                label="Short (₹)"
                placeholder="e.g., 2500"
                value={rateCardData.youtubeShortCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('youtubeShortCharge', e.target.value)}
                isError={!!rateCardErrors.youtubeShortCharge}
                hintText={rateCardErrors.youtubeShortCharge}
              />
              <Input
                label="Integration (₹)"
                placeholder="e.g., 4000"
                value={rateCardData.youtubeIntegrationCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('youtubeIntegrationCharge', e.target.value)}
                isError={!!rateCardErrors.youtubeIntegrationCharge}
                hintText={rateCardErrors.youtubeIntegrationCharge}
              />
              <Input
                label="Dedicated Video (₹)"
                placeholder="e.g., 8000"
                value={rateCardData.youtubeDedicatedVideoCharge?.toString() || ''}
                onChange={(e) => handleRateCardChange('youtubeDedicatedVideoCharge', e.target.value)}
                isError={!!rateCardErrors.youtubeDedicatedVideoCharge}
                hintText={rateCardErrors.youtubeDedicatedVideoCharge}
              />
            </div>
          </div>

          {/* Other Details */}
          <div>
            <div className="flex! items-center! gap-2! mb-3!">
              <IndianRupee className="text-green-600!" size={20} />
              <h3 className="text-lg! font-semibold! text-gray-800!">Other Details</h3>
            </div>
            <div className="space-y-4!">
              <div>
                <label className="block! text-sm! font-medium! text-gray-700! mb-1!">
                  Custom Package Description
                </label>
                <textarea
                  className="w-full! px-3! py-2! border! border-gray-300! rounded-lg! focus:outline-none! focus:ring-2! focus:ring-blue-500! focus:border-blue-500! resize-none!"
                  rows={3}
                  placeholder="e.g., Custom package includes 1 Reel + 3 Stories + Link in Bio for 1 week"
                  value={rateCardData.customComboPackage || ''}
                  onChange={(e) => handleRateCardChange('customComboPackage', e.target.value)}
                />
                {rateCardErrors.customComboPackage && (
                  <p className="text-red-600! text-sm! mt-1!">{rateCardErrors.customComboPackage}</p>
                )}
                <p className="text-xs! text-gray-500! mt-1!">
                  {(rateCardData.customComboPackage || '').length}/1000 characters
                </p>
              </div>
              <Input
                label="Minimum Collaboration Value (₹)"
                placeholder="e.g., 5000"
                value={rateCardData.minimumCollaborationValue?.toString() || ''}
                onChange={(e) => handleRateCardChange('minimumCollaborationValue', e.target.value)}
                isError={!!rateCardErrors.minimumCollaborationValue}
                hintText={rateCardErrors.minimumCollaborationValue}
              />
              <div>
                <label className="flex! items-center! gap-2! cursor-pointer!">
                  <input
                    type="checkbox"
                    className="w-4! h-4! text-blue-600! bg-gray-100! border-gray-300! rounded! focus:ring-blue-500! focus:ring-2!"
                    checked={rateCardData.availableForBarterDeals || false}
                    onChange={(e) => handleRateCardChange('availableForBarterDeals', e.target.checked)}
                  />
                  <span className="text-sm! text-gray-700!">Available for Barter Deals</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex! gap-2! justify-end! pt-4! border-t! border-gray-200! mt-6!">
          <Button
            title="Cancel"
            variant="danger"
            isOutlined
            onClick={() => setIsRateCardModalOpen(false)}
            disabled={createRateCardMutation.isPending || updateRateCardMutation.isPending}
          />
          <Button
            title={
              createRateCardMutation.isPending || updateRateCardMutation.isPending
                ? "Saving..."
                : rateCard
                ? "Update Rate Card"
                : "Create Rate Card"
            }
            onClick={handleRateCardSubmit}
            disabled={createRateCardMutation.isPending || updateRateCardMutation.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
} 