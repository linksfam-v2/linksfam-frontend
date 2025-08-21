import { useInfiniteQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { getCreators } from "../../../services/company/links/links";
import { useRef, useCallback, useState } from "react";
import { 
  Search, 
  Filter, 
  Eye, 
  Users, 
  ExternalLink, 
  Star,
  Instagram,
  TrendingUp,
  Grid3x3,
  List,
  Hash,
} from "lucide-react";

const Creator = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetching paginated creators
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["GET_CREATORS"],
    queryFn: ({ pageParam = 1 }) => getCreators(URL.getCreators(pageParam)),
    getNextPageParam: (lastPage, _allPages) => {
      const nextPage = lastPage?.data?.pagination?.currentPage + 1;
      return nextPage <= lastPage?.data?.pagination?.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  // Flattening the paginated data
  const creators = data?.pages.flatMap((page) => page?.data?.data) || [];

  // Filter creators based on search term
  const filteredCreators = creators.filter((creator: any) => 
    creator?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator?.Platforms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Intersection Observer to trigger fetchNextPage
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const formatFollowers = (count: number | string) => {
    const num = typeof count === 'string' ? parseInt(count) : count;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toString() || '0';
  };

  const getRandomStats = (index: number) => {
    // Generate consistent random-ish stats based on index for demo
    const followers = [15000, 25000, 8500, 42000, 75000, 120000, 3400, 18500][index % 8] || 10000;
    const engagement = [2.1, 3.5, 4.2, 2.8, 3.1, 4.8, 2.9, 3.7][index % 8] || 3.0;
    const posts = [156, 243, 89, 324, 567, 123, 298, 445][index % 8] || 200;
    
    return { followers, engagement, posts };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="text-white" size={24} />
          </div>
          <p className="text-gray-600 font-medium">Discovering creators...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Creators</h1>
            <p className="text-gray-600">Find and connect with top influencers for your campaigns</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search creators by name or platform..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* View Toggle & Filter */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid3x3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <Filter size={16} />
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users size={14} />
                <span>{filteredCreators.length} creators found</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp size={14} />
                <span>All categories</span>
              </div>
            </div>
          </div>

          {/* Creators Grid/List */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredCreators.map((creator: any, index: number) => {
              const stats = getRandomStats(index);
              const platforms = creator?.Platforms?.split(" ") || [];
              const instagramHandle = platforms.find((p: string) => p.startsWith("@"));

              if (viewMode === 'grid') {
                return (
                  <div 
                    key={index} 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
                    ref={index === filteredCreators.length - 1 ? lastElementRef : null}
                  >
                    {/* Creator Avatar & Header */}
                    <div className="relative">
                      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 p-6 text-center">
                        <div className="relative inline-block">
                          <img 
                            src={`https://i.pravatar.cc/150?img=${index + 1}`} 
                            alt={creator?.Name || 'Creator'} 
                            className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg mx-auto"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-3 border-white flex items-center justify-center">
                            <Instagram size={12} className="text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Verified Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star size={12} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {creator?.Name || 'Creator Name'}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                          <Hash size={12} />
                          <span>Lifestyle • Fashion</span>
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{formatFollowers(stats.followers)}</div>
                          <div className="text-xs text-gray-500">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{stats.engagement}%</div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{stats.posts}</div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {instagramHandle && (
                        <a
                          href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 group"
                        >
                          <Instagram size={16} />
                          <span>View Profile</span>
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div 
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                    ref={index === filteredCreators.length - 1 ? lastElementRef : null}
                  >
                    <div className="flex items-center space-x-6">
                      {/* Avatar */}
                      <div className="relative">
                        <img 
                          src={`https://i.pravatar.cc/150?img=${index + 1}`} 
                          alt={creator?.Name || 'Creator'} 
                          className="w-16 h-16 rounded-xl shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                          <Instagram size={10} className="text-white" />
                        </div>
                      </div>

                      {/* Creator Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-800">{creator?.Name || 'Creator Name'}</h3>
                          <Star size={16} className="text-blue-500" />
                        </div>
                        <p className="text-gray-600 text-sm mb-2">Lifestyle • Fashion • Beauty</p>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{formatFollowers(stats.followers)} followers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp size={14} />
                            <span>{stats.engagement}% engagement</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{stats.posts} posts</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {instagramHandle && (
                        <a
                          href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-6 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                        >
                          <Instagram size={16} />
                          <span>View Profile</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Loading More */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Loading more creators...</span>
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredCreators.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No creators found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* End Message */}
          {!hasNextPage && creators.length > 0 && (
            <div className="text-center py-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 inline-block">
                <p className="text-gray-600 font-medium">🎉 You've seen all available creators!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Creator;
