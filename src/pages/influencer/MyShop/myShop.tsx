import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Button from '../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { getInfluencerId, getSocialdets } from '../../../services/influencer/profile/profile';
import { URL } from '../../../constants/URL';
import ProductSheet from '../../../components/Sheet/ProductSheet';
import InfluencerSocials from '../Social/Social';
import { Package, Plus, ArrowUpRight } from 'lucide-react';

interface ShopPost {
  id: number;
  title: string;
  description: string;
  productUrls: string[];
  mediaUrl: string;
  thumbnailUrl?: string;
  influencerId: number;
  createdAt: string;
  updatedAt: string;
}

interface PostsResponse {
  data: ShopPost[];
}

const MyShop = () => {
  const navigate = useNavigate();
  const limit = 12;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProductUrls, setSelectedProductUrls] = useState<string[]>([]);


  const { data: _profile } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['INFLUENCER_SHOP_POSTS'],
    queryFn: async ({ pageParam }) => {
      const response = await getSocialdets(`${URL.getShopPosts()}?skip=${pageParam}&limit=${limit}`);
      return response as PostsResponse;
    },
    getNextPageParam: (lastPage, allPages) => {
      const morePostsExist = lastPage.data.length === limit;
      if (!morePostsExist) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Setup intersection observer for infinite scrolling
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    
    if (element) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      });
      
      observerRef.current.observe(element);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleOpenProductSheet = (productUrls: string[]) => {
    if (productUrls.length > 0) {
      setSelectedProductUrls(productUrls);
      setIsSheetOpen(true);
    }
  };

  const handleCloseProductSheet = () => {
    setIsSheetOpen(false);
  };

  // Flatten the pages data
  const allPosts = data?.pages.flatMap(page => page.data) || [];



  if(_profile?.data[0]?.is_yt_eligible === false && _profile?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Package className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Shop</h1>
              <p className="text-gray-600 text-sm">Your product showcase</p>
            </div>
          </div>
          
          <Button 
            title="Add Post" 
            onClick={() => navigate('/creator/add-post')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            leftChildren={<Plus size={16} />}
          />
        </div>

        {allPosts.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="flex flex-col items-center mb-2">
              <span className="text-6xl mb-2" role="img" aria-label="empty box">📦</span>
              <div className="text-center text-gray-500 text-lg font-medium">No posts yet</div>
            </div>
            <p className="text-gray-400 text-center">Add your first post to showcase your products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative pb-[56.25%]">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px] mb-2">{post.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                    {post.productUrls && post.productUrls.length > 0 ? (
                      <div className="relative">
                        <button
                          onClick={() => handleOpenProductSheet(post.productUrls)}
                          className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center"
                        >
                          <Package size={16} />
                          <ArrowUpRight
                            size={16}
                            className="h-4 w-4 ml-1"
                          />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No product links</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-10 flex justify-center items-center mt-8"
          >
            {isFetchingNextPage && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            )}
          </div>
        )}
      </div>

      <ProductSheet
        open={isSheetOpen}
        onClose={handleCloseProductSheet}
        productUrls={selectedProductUrls}
      />
    </div>
  );
};

export default MyShop;
