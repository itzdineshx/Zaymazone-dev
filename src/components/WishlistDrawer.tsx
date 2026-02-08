import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Star, MapPin, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/api";

export const WishlistDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { wishlist, isLoading, removeFromWishlist, getTotalItems } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      // Error is handled in wishlist context
    }
  };

  const itemCount = getTotalItems();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Heart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-primary flex items-center justify-center">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Wishlist ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Wishlist Items */}
          <div className="flex-1 overflow-auto px-6">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Please sign in to view your wishlist</p>
                <Button 
                  className="mt-2" 
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Loading wishlist...</p>
              </div>
            ) : (!wishlist || !wishlist.products || wishlist.products.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your wishlist is empty</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsOpen(false)}
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.products.map((item) => (
                  <div key={item.productId._id} className="flex gap-4 p-4 border rounded-lg">
                    <Link 
                      to={`/product/${item.productId._id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex-shrink-0"
                    >
                      <img 
                        src={getImageUrl(item.productId.images[0])} 
                        alt={item.productId.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.productId._id}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          {item.productId.name}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{item.productId.rating}</span>
                        <span className="text-xs text-muted-foreground">({item.productId.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-sm">₹{item.productId.price.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(item.productId._id)}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {itemCount > 0 && (
            <div className="border-t p-6 space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};