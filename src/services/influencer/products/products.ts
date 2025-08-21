import { URL, HTTP_METHOD } from '../../../constants/URL';

// Types based on API documentation
export interface Product {
  id: number;
  productUrl: string;
  productName: string;
  imageUrl: string;
  productDescription?: string | null;
  sitename?: string | null;
  price?: number | null;
  influencerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      skip: number;
      limit: number;
      total: number;
      returned: number;
      hasMore: boolean;
      nextSkip: number | null;
    };
  };
}

export interface AddProductRequest {
  productUrl: string;
  productName: string;
  imageUrl: string;
  productDescription?: string;
  sitename?: string;
  price?: number;
}

export interface AddProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
  data: {
    deletedProductId: number;
    productName: string;
    deletedAt: string;
  };
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Get products with pagination
export const getProducts = async (influencerId: number, skip: number = 0, limit: number = 10): Promise<ProductsResponse> => {
  const url = `${URL.getProducts()}?influencerId=${influencerId}&skip=${skip}&limit=${limit}`;
  
  const response = await fetch(url, {
    method: HTTP_METHOD.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
};

// Add a new product
export const addProduct = async (productData: AddProductRequest): Promise<AddProductResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(URL.addProduct(), {
    method: HTTP_METHOD.POST,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to add product: ${response.statusText}`);
  }

  return response.json();
};

// Delete a product
export const deleteProduct = async (productId: number): Promise<DeleteProductResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(URL.deleteProduct(productId), {
    method: HTTP_METHOD.DELETE,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete product: ${response.statusText}`);
  }

  return response.json();
}; 