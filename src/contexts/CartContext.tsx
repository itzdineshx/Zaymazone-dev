import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi, Cart, CartItem } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const cartData = await cartApi.get();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Don't show error toast for cart fetch failures
      setCart({ items: [], total: 0, itemCount: 0, updatedAt: new Date().toISOString() });
      // Only show toast for network errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Unable to connect to server. Cart functionality may be limited.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1): Promise<void> => {
    // Skip API call for mock products
    if (productId === 'mock-paytm-test-product') {
      toast.success('Mock product added to cart (test mode)');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.add(productId, quantity);
      setCart(response.cart);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await cartApi.updateItem(productId, quantity);
      setCart(response.cart);
      if (quantity === 0) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Cart updated');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await cartApi.removeItem(productId);
      await refreshCart(); // Refresh to get updated cart
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await cartApi.clear();
      setCart({ items: [], total: 0, itemCount: 0, updatedAt: new Date().toISOString() });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to clear cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalItems = (): number => {
    return cart?.itemCount || 0;
  };

  const getTotalPrice = (): number => {
    return cart?.total || 0;
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};