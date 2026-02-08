import { useEffect } from 'react';

// Google Analytics Measurement ID - replace with your actual GA4 ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'; // Configure in .env

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics = () => {
  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    // Track page views on route changes
    const handleRouteChange = () => {
      if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_title: document.title,
          page_path: window.location.pathname + window.location.search
        });
      }
    };

    // Listen for route changes (for SPA)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null; // This component doesn't render anything
};

// Utility functions for tracking events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (pageTitle: string, pagePath: string) => {
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: pageTitle,
      page_path: pagePath
    });
  }
};

export const trackPurchase = (transactionId: string, value: number, currency: string = 'INR', items: any[] = []) => {
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    });
  }
};

export const trackAddToCart = (item: any) => {
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [item]
    });
  }
};

export const trackViewItem = (item: any) => {
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      items: [item]
    });
  }
};

export default GoogleAnalytics;