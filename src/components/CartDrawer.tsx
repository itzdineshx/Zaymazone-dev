import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, X, Loader2, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/api";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, isLoading, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      // Error is handled in cart context
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      // Error is handled in cart context
    }
  };

  const itemCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice + shippingCost;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto px-6">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Please sign in to view your cart</p>
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
                <p className="text-muted-foreground mt-2">Loading cart...</p>
              </div>
            ) : (!cart || cart.items.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId.id} className="flex gap-4 p-4 border rounded-lg">
                    <img 
                      src={getImageUrl(item.productId.images[0])} 
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.productId.name}</h4>
                      <p className="text-xs text-muted-foreground">₹{item.productId.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(item.productId.id, item.quantity - 1)}
                          disabled={isLoading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(item.productId.id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive ml-auto"
                          onClick={() => handleRemoveItem(item.productId.id)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-sm font-medium mt-1">
                        ₹{(item.productId.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {isAuthenticated && cart && cart.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-xs text-primary">Free shipping on orders over ₹1,000!</p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow" 
                asChild
                disabled={isLoading}
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              
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