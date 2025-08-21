import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Play, Instagram, Youtube, Clock, Eye, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getYouTubeVideos, 
  crossPostToInstagram, 
  YouTubeVideo, 
  CrossPostRequest 
} from '../../../services/influencer/social/social';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';

const CrossPost: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [caption, setCaption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch YouTube videos
  const { data: videosData, isLoading: videosLoading, error: videosError } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: () => getYouTubeVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Cross-post mutation
  const crossPostMutation = useMutation({
    mutationFn: (data: CrossPostRequest) => crossPostToInstagram(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Video successfully posted to Instagram!');
      setIsModalOpen(false);
      setSelectedVideo(null);
      setCaption('');
      // Optionally refresh videos or update some state
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to post video to Instagram');
    },
  });

  const handleCrossPost = useCallback((video: YouTubeVideo) => {
    setSelectedVideo(video);
    setCaption(video.title); // Pre-fill with video title
    setIsModalOpen(true);
  }, []);

  const handleConfirmCrossPost = useCallback(() => {
    if (!selectedVideo) return;
    
    crossPostMutation.mutate({
      videoId: selectedVideo.videoId,
      caption: caption.trim() || undefined,
    });
  }, [selectedVideo, caption, crossPostMutation]);

  const formatDuration = (duration: string) => {
    // Assuming duration is in seconds or ISO format
    const seconds = parseInt(duration);
    if (isNaN(seconds)) return duration;
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (videosError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Youtube className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">
              {videosError instanceof Error ? videosError.message : 'Failed to load YouTube videos'}
            </p>
            <Button
              title="Try Again"
              onClick={() => window.location.reload()}
              variant="primary"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-8 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Cross-Post to Instagram</h1>
          <p className="text-white/80">Share your YouTube videos as Instagram Reels</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-12 pb-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm overflow-hidden">
          {/* Stats Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your YouTube Videos</h2>
                  <p className="text-sm text-gray-600">
                    {videosData?.data?.length || 0} videos available
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Share2 className="w-4 h-4" />
                <span>Cross-post to Instagram</span>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="p-6">
            {videosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : videosData?.data?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videosData.data.map((video) => (
                  <div
                    key={video.id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 group-hover:bg-white rounded-full p-3 group-hover:scale-110 transition-all duration-300">
                          <Play className="w-6 h-6 text-gray-800" fill="currentColor" />
                        </div>
                      </div>

                      {/* Duration Badge - Hide if no duration */}
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDuration(video.duration)}
                        </div>
                      )}

                      {/* Short Badge - Hide if no isShort property */}
                      {video.isShort && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          #Short
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatCount(video.viewCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{formatCount(video.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{formatCount(video.comments)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatDate(video.publishedDate)}
                        </span>
                        <button
                          onClick={() => handleCrossPost(video)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium group-hover:scale-105"
                        >
                          <Instagram className="w-4 h-4" />
                          <span>Post to IG</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Youtube className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Make sure you have YouTube videos in your channel and that your account is properly connected.
                </p>
              </div>
            )}

            {/* Load More Button - Remove pagination for now as API doesn't support it */}
            {false && (
              <div className="text-center mt-8">
                <Button
                  title="Load More Videos"
                  onClick={() => {}}
                  variant="primary"
                  disabled={videosLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Post Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post to Instagram"
        size="md"
      >
        {selectedVideo && (
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="flex items-start space-x-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={selectedVideo.thumbnailUrl}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" fill="currentColor" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {selectedVideo.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span>{formatCount(selectedVideo.viewCount)} views</span>
                  <span>•</span>
                  <span>{formatDate(selectedVideo.publishedDate)}</span>
                </div>
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Caption
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Write a caption for your Instagram reel..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={2200}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Leave empty to use video title as caption
                </p>
                <span className="text-xs text-gray-400">
                  {caption.length}/2200
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button
                title="Cancel"
                variant="danger"
                isOutlined
                onClick={() => setIsModalOpen(false)}
                disabled={crossPostMutation.isPending}
              />
              <Button
                title={crossPostMutation.isPending ? "Posting..." : "Post to Instagram"}
                onClick={handleConfirmCrossPost}
                disabled={crossPostMutation.isPending}
                variant="primary"
                leftChildren={crossPostMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Instagram className="w-4 h-4" />
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CrossPost; 