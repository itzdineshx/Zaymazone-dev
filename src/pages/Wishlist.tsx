import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { api, getImageUrl } from "@/lib/api";
import { Heart, ShoppingBag, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist, isLoading, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be logged in to view your wishlist</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            Items you've saved for later ({wishlist?.products?.length || 0} items)
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : !wishlist?.products || wishlist.products.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save items you love for later. Start browsing our collection of handcrafted products.
            </p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.products.map((item: any) => (
              <Card key={item.productId?._id || item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <img
                    src={getImageUrl(item.productId?.images?.[0] || item.image || '/placeholder.svg')}
                    alt={item.productId?.name || item.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full p-0"
                    onClick={() => handleRemoveFromWishlist(item.productId?._id || item._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <Link to={`/product/${item.productId?._id || item._id}`}>
                    <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                      {item.productId?.name || item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    by {item.productId?.artisan?.name || item.artisan?.name || 'Unknown Artisan'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      ₹{(item.productId?.price || item.price || 0).toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item.productId?._id || item._id)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;