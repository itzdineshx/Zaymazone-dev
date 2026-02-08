import { trackEvent, trackAddToCart, trackViewItem, trackPurchase } from '@/components/GoogleAnalytics';

// Analytics event tracking utilities
export const analytics = {
  // User authentication events
  signUp: (method: string) => {
    trackEvent('sign_up', {
      method: method
    });
  },

  signIn: (method: string) => {
    trackEvent('login', {
      method: method
    });
  },

  // Product events
  viewProduct: (product: any) => {
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price,
      currency: 'INR'
    });
  },

  addToCart: (product: any, quantity: number = 1) => {
    trackAddToCart({
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price,
      currency: 'INR',
      quantity: quantity
    });
  },

  // Cart and checkout events
  beginCheckout: (cartItems: any[], totalValue: number) => {
    trackEvent('begin_checkout', {
      currency: 'INR',
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  purchase: (orderId: string, totalValue: number, items: any[]) => {
    trackPurchase(orderId, totalValue, 'INR', items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity
    })));
  },

  // Artisan and seller events
  startSelling: () => {
    trackEvent('start_selling');
  },

  artisanSignup: () => {
    trackEvent('artisan_signup');
  },

  // Navigation and engagement events
  search: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm
    });
  },

  contactForm: () => {
    trackEvent('contact_form_submit');
  },

  newsletterSignup: () => {
    trackEvent('newsletter_signup');
  },

  // Social sharing events
  shareProduct: (productId: string, platform: string) => {
    trackEvent('share', {
      method: platform,
      content_type: 'product',
      item_id: productId
    });
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent('exception', {
      description: errorMessage,
      fatal: false
    });
  }
};

export default analytics;