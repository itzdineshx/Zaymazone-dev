import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, MapPin, User, Star, Package, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    rewardPoints: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersData, wishlistData] = await Promise.all([
        api.getUserOrders().catch(() => ({ orders: [] })),
        api.getWishlist().catch(() => [])
      ]);

      // Ensure wishlistData is an array
      const wishlistItems = Array.isArray(wishlistData)
        ? wishlistData
        : (wishlistData && Array.isArray((wishlistData as any).products)
           ? (wishlistData as any).products
           : []);
      // Calculate reward points based on total spent (simplified calculation)
      const totalSpent = (ordersData.orders || []).reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const rewardPoints = Math.floor(totalSpent / 10); // 1 point per 10 rupees spent

      setStats({
        totalOrders: ordersData.orders?.length || 0,
        wishlistItems: wishlistItems.length || 0,
        rewardPoints
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardItems = [
    {
      title: 'My Orders',
      description: 'Track your orders and purchase history',
      icon: ShoppingBag,
      href: '/orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10'
    },
    {
      title: 'Wishlist',
      description: 'View your saved favorite items',
      icon: Heart,
      href: '/wishlist',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/10'
    },
    {
      title: 'Addresses',
      description: 'Manage your delivery addresses',
      icon: MapPin,
      href: '/addresses',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/10'
    },
    {
      title: 'Profile',
      description: 'Update your personal information',
      icon: User,
      href: '/profile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10'
    },
    {
      title: 'Reviews',
      description: 'Your product reviews and ratings',
      icon: Star,
      href: '/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/10'
    },
    {
      title: 'Returns',
      description: 'Manage returns and refunds',
      icon: Package,
      href: '/returns',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be logged in to access your dashboard</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your account and explore amazing handcrafted products
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  )}
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <p className="text-2xl font-bold">{stats.wishlistItems}</p>
                  )}
                </div>
                <Heart className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reward Points</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <p className="text-2xl font-bold">{stats.rewardPoints.toLocaleString()}</p>
                  )}
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${item.bgColor}`}>
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions on Zaymazone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order #12345 delivered</p>
                    <p className="text-sm text-muted-foreground">Handcrafted Terracotta Vase - 2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Added item to wishlist</p>
                    <p className="text-sm text-muted-foreground">Kashmiri Pashmina Shawl - 1 week ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Review submitted</p>
                    <p className="text-sm text-muted-foreground">Blue Pottery Dinner Set - 1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-2">Continue Shopping</h3>
              <p className="mb-4 opacity-90">
                Discover more amazing handcrafted products from talented artisans
              </p>
              <Link to="/shop">
                <Button variant="secondary" size="lg">
                  Explore Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;