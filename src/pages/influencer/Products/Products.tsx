import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ExternalLink, Package, Loader } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/Modal/Modal';
import { getProducts, addProduct, deleteProduct, Product, AddProductRequest } from '../../../services/influencer/products/products';
import { getInfluencerId } from '../../../services/influencer/profile/profile';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import { URL, HTTP_METHOD } from '../../../constants/URL';
import InfluencerSocials from '../Social/Social';

// OpenGraph data interface
interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  price?: string;
}

// Function to fetch OpenGraph data
const fetchOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  const response = await fetch(URL.getOpenGraph(url), {
    method: HTTP_METHOD.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product data: ${response.statusText}`);
  }
  
  const responseData = await response.json();
  return responseData.data || {};
};

// Validation schema for Formik
const productValidationSchema = Yup.object({
  productUrl: Yup.string()
    .required('Product URL is required')
    .url('Please enter a valid URL'),
  productName: Yup.string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  imageUrl: Yup.string()
    .required('Image URL is required')
    .url('Please enter a valid image URL'),
  sitename: Yup.string()
    .max(50, 'Site name must be less than 50 characters'),
  price: Yup.number()
    .positive('Price must be a positive number')
    .max(999999, 'Price must be less than 999,999'),
  productDescription: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
});

// Note: Using Tailwind's built-in line-clamp utilities (line-clamp-2, line-clamp-3)

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [skip, setSkip] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFetchingOG, setIsFetchingOG] = useState(false);
  const [urlFetchError, setUrlFetchError] = useState<string>('');
  
  // Initial form values
  const initialFormValues: AddProductRequest = {
    productUrl: '',
    productName: '',
    imageUrl: '',
    productDescription: '',
    sitename: '',
    price: undefined,
  };

  // Get influencer profile to extract influencerId
  const { data: profileData } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const influencerId = profileData?.data?.[0]?.id;

  // Fetch products
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', influencerId, skip],
    queryFn: () => getProducts(influencerId, skip, 10),
    enabled: !!influencerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update products list when data changes
  useEffect(() => {
    if (productsData?.data.products) {
      if (skip === 0) {
        setAllProducts(productsData.data.products);
      } else {
        setAllProducts(prev => [...prev, ...productsData.data.products]);
      }
    }
  }, [productsData?.data.products, skip]);

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowAddForm(false);
      setSkip(0); // Reset to first page
    },
    onError: (error: any) => {
      alert(`Error adding product: ${error.message}`);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      alert(`Error deleting product: ${error.message}`);
    },
  });

  // Handle URL fetch and form prefill
  const handleUrlFetch = async (url: string, setFieldValue: (field: string, value: any) => void) => {
    if (!url || !url.trim()) return;
    
    setIsFetchingOG(true);
    setUrlFetchError('');
    
    try {
      const ogData = await fetchOpenGraphData(url.trim());
      
      // Prefill form fields with OpenGraph data
      if (ogData.title) {
        const trimmedTitle = ogData.title.length > 100 ? ogData.title.substring(0, 100) : ogData.title;
        setFieldValue('productName', trimmedTitle);
      }
      if (ogData.image) {
        setFieldValue('imageUrl', ogData.image);
      }
      if (ogData.siteName) {
        setFieldValue('sitename', ogData.siteName);
      }
      if (ogData.description) {
        setFieldValue('productDescription', ogData.description);
      }
      if (ogData.price) {
        // Try to extract numeric price from string
        const numericPrice = parseFloat(ogData.price.replace(/[^\d.]/g, ''));
        if (!isNaN(numericPrice)) {
          setFieldValue('price', numericPrice);
        }
      }
    } catch (error) {
      console.error('Error fetching OpenGraph data:', error);
      setUrlFetchError('Failed to fetch product details. Please fill in manually.');
    } finally {
      setIsFetchingOG(false);
    }
  };

  const handleFormSubmit = (values: AddProductRequest) => {
    addProductMutation.mutate(values);
  };

  const handleDelete = (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  const loadMoreProducts = () => {
    if (productsData?.data.pagination.hasMore) {
      setSkip(prev => prev + 10);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return 'Price not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if(profileData?.data[0]?.is_yt_eligible === false && profileData?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Products</h3>
            <p className="text-gray-600 mb-6">{(error as Error).message}</p>
            <Button 
              title="Retry" 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 px-4 py-8 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Header content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Package size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">My Products</h1>
              <p className="text-white/80 text-sm">Showcase your favorite products</p>
            </div>
          </div>
          <Button
            title="Add Product"
            onClick={() => setShowAddForm(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            leftChildren={<Plus size={16} />}
          />
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal 
        open={showAddForm} 
        onClose={() => setShowAddForm(false)}
        title="Add New Product"
        size="md"
      >
        <Formik
          initialValues={initialFormValues}
          validationSchema={productValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700">
                  Product URL *
                </label>
                <div className="relative">
                  <Input
                    id="productUrl"
                    name="productUrl"
                    type="url"
                    value={values.productUrl}
                    onChange={handleChange}
                    onBlur={(e) => {
                      handleBlur(e);
                      if (e.target.value && e.target.value.trim()) {
                        handleUrlFetch(e.target.value, setFieldValue);
                      }
                    }}
                    placeholder="https://example.com/product"
                    isRequired={true}
                    isError={!!(errors.productUrl && touched.productUrl)}
                    hintText={errors.productUrl && touched.productUrl ? errors.productUrl : urlFetchError || 'Enter URL and we\'ll fetch product details automatically'}
                  />
                  {isFetchingOG && (
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <Loader size={16} className="mr-2 animate-spin" />
                      <span>Fetching details...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <Input
                    id="productName"
                    name="productName"
                    type="text"
                    value={values.productName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter product name"
                    isRequired={true}
                    isError={!!(errors.productName && touched.productName)}
                    hintText={errors.productName && touched.productName ? errors.productName : ''}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="sitename" className="block text-sm font-medium text-gray-700">
                    Store/Site Name
                  </label>
                  <Input
                    id="sitename"
                    name="sitename"
                    type="text"
                    value={values.sitename || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Amazon, Flipkart"
                    isError={!!(errors.sitename && touched.sitename)}
                    hintText={errors.sitename && touched.sitename ? errors.sitename : ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    Image URL *
                  </label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={values.imageUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="https://example.com/image.jpg"
                    isRequired={true}
                    isError={!!(errors.imageUrl && touched.imageUrl)}
                    hintText={errors.imageUrl && touched.imageUrl ? errors.imageUrl : ''}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={values.price?.toString() || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    isError={!!(errors.price && touched.price)}
                    hintText={errors.price && touched.price ? errors.price : ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Input
                  id="productDescription"
                  name="productDescription"
                  value={values.productDescription || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Brief description of the product"
                  isTextArea={true}
                  isError={!!(errors.productDescription && touched.productDescription)}
                  hintText={errors.productDescription && touched.productDescription ? errors.productDescription : ''}
                />
              </div>

              {/* Image preview */}
              {values.imageUrl && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Preview</label>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <img
                      src={values.imageUrl}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  title="Cancel"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  variant="danger"
                  className="flex-1"
                />
                <Button
                  title={isSubmitting ? 'Adding...' : 'Add Product'}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Products List */}
      <div className="px-4 -mt-12 pb-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm p-6">
          {isLoading && allProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your products...</p>
            </div>
          ) : allProducts.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Your Products ({allProducts.length})
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="aspect-square w-full relative overflow-hidden" id={`product-image-container-${product.id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(_e) => {
                          console.log('Product image failed to load:', product.imageUrl);
                          const imageContainer = document.getElementById(`product-image-container-${product.id}`);
                          if (imageContainer) {
                            imageContainer.style.display = 'none';
                          }
                        }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Action buttons overlay */}
                      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                          onClick={() => window.open(product.productUrl, '_blank')}
                          title="View Product"
                        >
                          <ExternalLink size={14} className="text-gray-700" />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                          onClick={() => handleDelete(product.id, product.productName)}
                          disabled={deleteProductMutation.isPending}
                          title="Delete Product"
                        >
                          <Trash2 size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {product.productName}
                      </h3>
                      
                      {product.sitename && (
                        <div className="mb-2">
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            {product.sitename}
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <span className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      
                      {product.productDescription && (
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                          {product.productDescription}
                        </p>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium"
                          onClick={() => window.open(product.productUrl, '_blank')}
                          title="View Product"
                        >
                          <ExternalLink size={14} />
                          <span>View</span>
                        </button>
                        
                        <button
                          className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                          onClick={() => handleDelete(product.id, product.productName)}
                          disabled={deleteProductMutation.isPending}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">
                            {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {productsData?.data.pagination.hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
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
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Products Yet</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Start by adding your first product to showcase to your audience and boost your earnings.
                </p>
                <Button 
                  title="Add Your First Product"
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  leftChildren={<Plus size={16} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 