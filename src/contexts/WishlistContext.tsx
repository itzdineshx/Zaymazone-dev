import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
  };
  addedAt: string;
}

interface Wishlist {
  products: WishlistItem[];
}

interface WishlistContextType {
  wishlist: Wishlist | null;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  getTotalItems: () => number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>({ products: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [isAuthenticated, user]);

  const refreshWishlist = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await api.getWishlist();
      
      // Handle different possible response formats
      if (Array.isArray(response)) {
        setWishlist({ products: response });
      } else if (response && typeof response === 'object' && 'products' in response && Array.isArray((response as any).products)) {
        setWishlist(response as Wishlist);
      } else {
        // Fallback to empty wishlist
        setWishlist({ products: [] });
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Set empty wishlist on error
      setWishlist({ products: [] });
      // Only show toast for network errors, not for authentication issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Unable to connect to server. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    if (!wishlist || !wishlist.products || !Array.isArray(wishlist.products)) return false;
    return wishlist.products.some(item => item.productId && item.productId._id === productId);
  };

  const addToWishlist = async (productId: string): Promise<void> => {
    // Skip API call for mock products
    if (productId === 'mock-paytm-test-product') {
      toast.success('Mock product added to wishlist (test mode)');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    if (isInWishlist(productId)) {
      toast.info('Item is already in your wishlist');
      return;
    }

    try {
      setIsLoading(true);
      await api.addToWishlist(productId);
      await refreshWishlist();
      toast.success('Added to wishlist');
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      toast.error(error.message || 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await api.removeFromWishlist(productId);
      await refreshWishlist();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      toast.error(error.message || 'Failed to remove from wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const clearWishlist = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await api.clearWishlist();
      setWishlist({ products: [] });
      toast.success('Wishlist cleared');
    } catch (error: any) {
      console.error('Error clearing wishlist:', error);
      toast.error(error.message || 'Failed to clear wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalItems = (): number => {
    if (!wishlist || !wishlist.products || !Array.isArray(wishlist.products)) return 0;
    return wishlist.products.length;
  };

  const value: WishlistContextType = {
    wishlist,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    refreshWishlist,
    getTotalItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};