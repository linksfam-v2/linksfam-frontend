import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { getSocialdets } from '../../../../services/influencer/profile/profile';
import { URL } from '../../../../constants/URL';
import { createShopPost } from '../../../../services/influencer/shop/shop';
import { useNavigate } from 'react-router-dom';
import { InstagramPost, YouTubeVideo } from '../../../../types/social';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters'),
  productLinks: Yup.array()
    .of(Yup.string().url('Please enter a valid URL').required('Product link is required'))
    .min(1, 'At least one product link is required')
    .test('no-empty-links', 'Please remove empty product links', function(value) {
      return value?.every(link => link && link.trim() !== '') ?? false;
    })
});

// Form values interface
interface FormValues {
  title: string;
  description: string;
  productLinks: string[];
  general?: string;
}

const AddPost = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<'youtube' | 'instagram'>('instagram');
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [allPosts, setAllPosts] = useState<InstagramPost[]>([]);
  const limit = 20;

  // YouTube videos query
  const { data: videos, isLoading: videosLoading } = useQuery<{ data: YouTubeVideo[] }>({
    queryKey: ['INFLUENCER_YOUTUBE_VIDEOS', page],
    queryFn: () =>
      getSocialdets(
        `${URL.getYoutubeVideos()}?skip=${(page - 1) * limit}&limit=${limit}`
      ),
    enabled: platform === 'youtube',
  });
  const refreshMutation = useMutation({
    mutationFn: (id: string) => getSocialdets(URL.refreshIGUrls(id)),
  });

  // Instagram posts query
  const { data: posts, isLoading: postsLoading } = useQuery<{ data: InstagramPost[] }>({
    queryKey: ['INFLUENCER_INSTAGRAM_POSTS_PAGINATED', page],
    queryFn: () => {
      const url = page === 1 
        ? URL.getInstagramPosts()
        : `${URL.getInstagramPosts()}?skip=${(page - 1) * limit}&limit=${limit}`;
      return getSocialdets(url);
    },
    enabled: platform === 'instagram',
  });

  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  // Create mutation for shop post creation
  const shopPostMutation = useMutation({
    mutationFn: createShopPost,
    onSuccess: (response: any) => {
      // Call refresh mutation after successful post creation
      if (platform === 'instagram' && response?.data?.id) {
        refreshMutation.mutate(String(response.data.id));
      }
      navigate('/creator/my-shop');
    },
    onError: (error: any) => {
      console.error('Failed to create post:', error);
    },
  });

  // Reset page when platform changes
  useEffect(() => {
    setPage(1);
    setAllVideos([]);
    setAllPosts([]);
    setSelectedVideo(null);
    setSelectedPost(null);
  }, [platform]);

  useEffect(() => {
    if (platform === 'youtube' && videos?.data) {
      if (page === 1) {
        setAllVideos(videos.data);
      } else {
        setAllVideos((prev) => [...prev, ...videos.data]);
      }
    }
  }, [videos?.data, page, platform]);

  useEffect(() => {
    if (platform === 'instagram' && posts?.data) {
      if (page === 1) {
        setAllPosts(posts.data);
      } else {
        setAllPosts((prev) => [...prev, ...posts.data]);
      }
    }
  }, [posts?.data, page, platform]);

  useEffect(() => {
    console.log('Current platform:', platform);
    console.log('All posts state:', allPosts);
    console.log('Posts query data:', posts);
  }, [platform, allPosts, posts]);

  useEffect(() => {
    if (selectedVideo) {
      setSelectedPost(null);
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (selectedPost) {
      // Use caption as title if available, otherwise use a default
      setSelectedVideo(null);
    }
  }, [selectedPost]);

  const handleSelectVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setSelectedPost(null);
  };

  const handleSelectPost = (post: InstagramPost) => {
    setSelectedPost(post);
    setSelectedVideo(null);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleSubmit = (values: FormValues, { setFieldError, setSubmitting }: any) => {
    if (platform === 'youtube' && !selectedVideo) {
      setFieldError('general', 'Please select a video first');
      setSubmitting(false);
      return;
    }

    if (platform === 'instagram' && !selectedPost) {
      setFieldError('general', 'Please select a post first');
      setSubmitting(false);
      return;
    }

    // Filter out any empty links
    const filteredLinks = values.productLinks.filter((link) => link && link.trim() !== '');

    // Create shop post with media data and multiple product links
    if (platform === 'youtube' && selectedVideo) {
      shopPostMutation.mutate({
        title: values.title,
        description: values.description,
        productUrls: filteredLinks,
        mediaUrl: selectedVideo.videoUrl,
        thumbnailUrl: selectedVideo.thumbnailUrl,
      });
    } else if (platform === 'instagram' && selectedPost) {
      shopPostMutation.mutate({
        title: values.title,
        description: values.description,
        productUrls: filteredLinks,
        mediaUrl: selectedPost.media_url,
        thumbnailUrl: selectedPost.thumbnail_url || selectedPost.permalink|| selectedPost.media_url,
        igPostId: String(selectedPost.postId),
        mediaExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    setSubmitting(false);
  };

  const getInitialValues = (): FormValues => {
    if (selectedVideo) {
      return {
        title: selectedVideo.title,
        description: selectedVideo.description,
        productLinks: ['']
      };
    }
    
    if (selectedPost) {
      return {
        title: selectedPost.caption ? selectedPost.caption.substring(0, 100) : 'Instagram Post',
        description: selectedPost.caption || '',
        productLinks: ['']
      };
    }
    
    return {
      title: '',
      description: '',
      productLinks: ['']
    };
  };

  const isLoading = platform === 'youtube' ? videosLoading : postsLoading;
  const currentData = platform === 'youtube' ? allVideos : allPosts;
  const hasMoreData = platform === 'youtube' 
    ? videos?.data?.length === limit 
    : posts?.data?.length === limit;

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center pb-14">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold mr-2">
            Add Post
          </span>
        </div>
        
        <div className="flex gap-6 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="platform"
              value="instagram"
              checked={platform === 'instagram'}
              onChange={(e) => setPlatform(e.target.value as 'instagram' | 'youtube')}
              className="mr-2"
            />
            Instagram
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="platform"
              value="youtube"
              checked={platform === 'youtube'}
              onChange={(e) => setPlatform(e.target.value as 'instagram' | 'youtube')}
              className="mr-2"
            />
            YouTube
          </label>
        </div>

        <div className="mb-2 font-semibold">Select your {platform === 'youtube' ? 'video' : 'post'}</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {isLoading ? (
            <div className="col-span-3 text-center py-4">Loading...</div>
          ) : currentData.length === 0 ? (
            <div className="col-span-3 text-center py-8 flex flex-col items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-gray-400 mb-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="text-gray-500 font-medium">
                No {platform === 'youtube' ? 'videos' : 'posts'} found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Please connect your {platform === 'youtube' ? 'YouTube' : 'Instagram'} account first
              </p>
            </div>
          ) : platform === 'youtube' ? (
            allVideos?.map((video) => (
              <button
                key={video.id}
                className="p-0 w-full"
                onClick={() => handleSelectVideo(video)}
                type="button"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  onError={(e) => {
                    e.currentTarget.src = `https://i.ytimg.com/vi/${video.videoId}/default.jpg`;
                  }}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))
          ) : (
            allPosts?.map((post) => {
              // Determine if it's a video based on the media_url extension or if it contains video indicators
              const isVideo = post.media_url?.includes('.mp4') || 
                             post.media_url?.includes('video') || 
                             post.media_url?.includes('reel') ||
                             post.permalink?.includes('/reel/') ||
                             post.media_type === 'VIDEO';
              
              return (
                <button
                  key={post.id}
                  className="p-0 w-full relative"
                  onClick={() => handleSelectPost(post)}
                  type="button"
                >
                  <div className="relative w-full h-24 bg-gray-200 overflow-hidden">
                    <img
                      src={post.thumbnail_url || post.media_url}
                      alt={post.caption || 'Instagram post'}
                      className="absolute inset-0 w-full h-full object-cover z-50"
                      onError={(e) => {
                        console.log('Image failed to load:', e.currentTarget.src);
                        // If thumbnail fails, try the media_url
                        if (e.currentTarget.src !== post.media_url) {
                          console.log('Trying fallback:', post.media_url);
                          e.currentTarget.src = post.media_url;
                        } else {
                          console.log('Both thumbnail and media_url failed');
                          // Hide the image if both fail
                          e.currentTarget.style.display = 'none';
                        }
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', post.thumbnail_url || post.media_url);
                      }}
                    />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3l14 9-14 9V3z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
        {hasMoreData && (
          <button
            onClick={handleLoadMore}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-md font-semibold mb-4 hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
        {(selectedVideo || selectedPost) && (
          <Formik
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }: FormikProps<FormValues>) => (
              <Form className="w-full bg-gray-50 rounded-lg p-4 flex flex-col gap-4">
                {errors.general && (
                  <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                    {errors.general}
                  </div>
                )}
                
                {shopPostMutation.error && (
                  <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                    {(shopPostMutation.error as any)?.message || 'Failed to create post. Please try again.'}
                  </div>
                )}

                <div>
                  <Input
                    label="Title"
                    name="title"
                    id="title"
                    type="text"
                    value={values.title}
                    onChange={(e) => setFieldValue('title', e.target.value)}
                    placeholder="Enter post title"
                    isRequired={true}
                    isError={!!(touched.title && errors.title)}
                    hintText={touched.title && errors.title ? errors.title : ''}
                  />
                </div>

                <div>
                  <Input
                    label="Description"
                    name="description"
                    id="description"
                    value={values.description}
                    onChange={(e) => setFieldValue('description', e.target.value)}
                    placeholder="Enter post description (optional)"
                    isTextArea={true}
                    isError={!!(touched.description && errors.description)}
                    hintText={touched.description && errors.description ? errors.description : ''}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Product Links*</label>
                    <button
                      type="button"
                      onClick={() => setFieldValue('productLinks', [...values.productLinks, ''])}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add Link
                    </button>
                  </div>
                  {values.productLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <Input
                          name={`productLinks.${index}`}
                          id={`productLinks.${index}`}
                          type="url"
                          value={link}
                          onChange={(e) => {
                            const updatedLinks = [...values.productLinks];
                            updatedLinks[index] = e.target.value;
                            setFieldValue('productLinks', updatedLinks);
                          }}
                          placeholder="Enter product link"
                          isError={!!(touched.productLinks && Array.isArray(touched.productLinks) && touched.productLinks[index] && errors.productLinks && Array.isArray(errors.productLinks) && errors.productLinks[index])}
                          hintText={touched.productLinks && Array.isArray(touched.productLinks) && touched.productLinks[index] && errors.productLinks && Array.isArray(errors.productLinks) && errors.productLinks[index] ? String(errors.productLinks[index]) : ''}
                        />
                      </div>
                      {values.productLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedLinks = [...values.productLinks];
                            updatedLinks.splice(index, 1);
                            setFieldValue('productLinks', updatedLinks);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {touched.productLinks && typeof errors.productLinks === 'string' && (
                    <div className="text-red-500 text-sm mt-1">{errors.productLinks}</div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || shopPostMutation.isPending}
                  title={isSubmitting || shopPostMutation.isPending ? 'Creating Post...' : 'Create Post'}
                />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AddPost;
