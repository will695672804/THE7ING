import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

// Backend base URL for media files
const BACKEND_URL = 'http://localhost:8000';

// Helper to build full image URL
const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Otherwise, prepend backend URL
  return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  features: string[];
}

interface ProductsContextType {
  products: Product[];
  addProduct: (productData: FormData) => Promise<void>;
  updateProduct: (id: string, productData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | undefined>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response: any = await apiService.getProducts();
      // Handle both {products: [...]} and direct array formats
      const productsArray = response?.products || response || [];
      const mappedProducts: Product[] = (Array.isArray(productsArray) ? productsArray : []).map((p: any) => ({
        id: p.id?.toString() ?? '',
        name: p.name ?? '',
        description: p.description ?? '',
        price: Number(p.price) || 0,
        image: getFullImageUrl(p.image ?? ''),
        category: p.category ?? '',
        rating: Number(p.rating) || 0,
        reviewsCount: Number(p.reviews_count) || 0,
        stock: Number(p.stock) || 0,
        features: typeof p.features === 'string' ? p.features.split(',') : (Array.isArray(p.features) ? p.features : []),
      }));
      setProducts(mappedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchProductById = async (id: string): Promise<Product | undefined> => {
    try {
      const response: any = await apiService.getProduct(id);
      // Handle both {product: {...}} and direct object formats
      const p: any = response?.product || response;
      if (!p) return undefined;
      return {
        id: p.id?.toString() ?? '',
        name: p.name ?? '',
        description: p.description ?? '',
        price: Number(p.price) || 0,
        image: getFullImageUrl(p.image ?? ''),
        category: p.category ?? '',
        rating: Number(p.rating) || 0,
        reviewsCount: Number(p.reviews_count) || 0,
        stock: Number(p.stock) || 0,
        features: typeof p.features === 'string' ? p.features.split(',') : (Array.isArray(p.features) ? p.features : []),
      };
    } catch (error: any) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: FormData) => {
    try {
      await apiService.addProduct(productData);
      await fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: FormData) => {
    try {
      await apiService.updateProduct(id, productData);
      await fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiService.deleteProduct(id);
      await fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const value: ProductsContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    fetchProductById,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};