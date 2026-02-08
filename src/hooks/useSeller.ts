import { useState, useEffect, useCallback, useRef } from 'react';
import { sellerService } from '@/services/sellerService';

interface SellerStats {
  totalSales?: number;
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  [key: string]: unknown;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  [key: string]: unknown;
}

export type { Pagination };

interface AnalyticsData {
  data?: unknown[];
  [key: string]: unknown;
}

interface AlertsData {
  alerts?: unknown[];
  [key: string]: unknown;
}

interface SellerProfile {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

// Hook for seller dashboard stats with auto-refresh
export const useSellerStats = (refreshInterval: number = 30000) => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await sellerService.getStats();
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up auto-refresh
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchStats, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStats, refreshInterval]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for seller products with pagination and search
export const useSellerProducts = (page: number = 1, limit: number = 10, search?: string, status?: string) => {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await sellerService.getProducts({ page, limit });
        setProducts(data.products || []);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, search, status]);

  return { products, pagination, loading, error };
};

// Hook for seller orders with real-time updates
export const useSellerOrders = (page: number = 1, limit: number = 10, status?: string, refreshInterval: number = 30000) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getOrders({ page, limit });
      setOrders(data.orders || []);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    fetchOrders();

    // Set up auto-refresh
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchOrders, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchOrders, refreshInterval]);

  return { orders, pagination, loading, error, refetch: fetchOrders };
};

// Hook for sales analytics
export const useSalesAnalytics = (period: string = '30days', refreshInterval: number = 60000) => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getSalesAnalytics(period);
      setSalesData(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales analytics');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();

    // Set up auto-refresh
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchAnalytics, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAnalytics, refreshInterval]);

  return { salesData, loading, error, refetch: fetchAnalytics };
};

// Hook for product analytics
export const useProductAnalytics = (refreshInterval: number = 60000) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getProductAnalytics();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchAnalytics, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAnalytics, refreshInterval]);

  return { products, loading, error, refetch: fetchAnalytics };
};

// Hook for revenue analytics
export const useRevenueAnalytics = (refreshInterval: number = 60000) => {
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getRevenueAnalytics();
      setRevenue(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchAnalytics, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAnalytics, refreshInterval]);

  return { revenue, loading, error, refetch: fetchAnalytics };
};

// Hook for customer analytics
export const useCustomerAnalytics = (refreshInterval: number = 60000) => {
  const [customers, setCustomers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getCustomerAnalytics();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchAnalytics, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAnalytics, refreshInterval]);

  return { customers, loading, error, refetch: fetchAnalytics };
};

// Hook for seller alerts
export const useSellerAlerts = (refreshInterval: number = 30000) => {
  const [alerts, setAlerts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getAlerts();
      setAlerts(data.alerts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchAlerts, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAlerts, refreshInterval]);

  return { alerts, loading, error, refetch: fetchAlerts };
};

// Hook for seller profile
export const useSellerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await sellerService.getProfile();
        setProfile(data.profile);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

