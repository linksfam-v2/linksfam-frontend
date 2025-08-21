

// Interface for OpenGraph data
export interface OpenGraphData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  price?: string;
  currency?: string;
  availability?: string;
  brand?: string;
  loading: boolean;
  error?: string;
}

// Function to fetch OpenGraph data for a URL through backend proxy
export const fetchOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  try {
    // This assumes there's a backend endpoint that can fetch OG data
    // You may need to adjust the endpoint based on your backend implementation
    const response = await fetch(`https://backend.linksfam.com/api/v1/utility/opengraph?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch link preview');
    }
    
    const data = await response.json();
    
    return {
      url,
      title: data.data.title || data.data.ogTitle || '',
      description: data.data.description || data.data.ogDescription || '',
      image: data.data.image || data.data.ogImage?.url || '',
      siteName: data.data.siteName || data.data.ogSiteName || '',
      price: data.data.product?.price || data.data.ogPrice || '',
      currency: data.data.product?.currency || data.data.ogCurrency || '',
      availability: data.data.product?.availability || '',
      brand: data.data.product?.brand || '',
      loading: false
    };
  } catch (error) {
    console.error('Error fetching OpenGraph data:', error);
    return {
      url,
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to load link preview'
    };
  }
}; 