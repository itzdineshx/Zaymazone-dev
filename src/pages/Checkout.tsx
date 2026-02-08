import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, Truck, MapPin, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { api, getImageUrl } from "@/lib/api";
import { artisanAnimations } from "@/lib/animations";
import { AnimatedInput } from "@/components/AnimatedInput";
import { analytics } from "@/lib/analytics";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { cart, isLoading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  
  // Check for direct purchase from location state
  const directPurchase = location.state?.directPurchase;
  const directProduct = location.state?.product;
  const directQuantity = location.state?.quantity || 1;
  
  const [isGuest, setIsGuest] = useState(!user);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // For direct purchase, we don't need cart validation
  const hasItems = directPurchase ? !!directProduct : (cart && cart.items.length > 0);

  // Redirect if no items (only for cart checkout)
  useEffect(() => {
    if (!directPurchase && !cartLoading && (!cart || cart.items.length === 0)) {
      toast({
        title: "Cart is empty",
        description: "Add some items to cart before checkout",
        variant: "destructive",
      });
      navigate('/shop');
    }
  }, [cart, cartLoading, navigate, toast, directPurchase]);

  // Track begin checkout event
  useEffect(() => {
    if (directPurchase && directProduct) {
      analytics.beginCheckout(
        [{
          id: directProduct.id,
          name: directProduct.name,
          category: directProduct.category,
          price: directProduct.price,
          quantity: directQuantity
        }],
        directProduct.price * directQuantity
      );
    } else if (cart && cart.items.length > 0) {
      analytics.beginCheckout(
        cart.items,
        cart.total
      );
    }
  }, [cart, directPurchase, directProduct, directQuantity]);

  const subtotal = directPurchase && directProduct 
    ? directProduct.price * directQuantity 
    : cart?.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0) || 0;
  const shipping = subtotal > 2000 ? 0 : 200; // Free shipping above ₹2000
  const codFee = paymentMethod === 'cod' ? 25 : 0; // COD handling fee
  const total = subtotal + shipping + codFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'phone', 'address', 'city', 'state', 'pincode'];
    if (isGuest && !formData.email) required.push('email');
    
    const missing = required.filter(field => !formData[field]);
    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsPlacingOrder(true);
    try {
      // Prepare order items based on purchase type
      const orderItems = directPurchase && directProduct ? [{
        productId: directProduct.id,
        quantity: directQuantity,
      }] : cart!.items.map(item => ({
        productId: item.productId.id,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email || user?.email || '',
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
          country: 'India',
          addressType: 'home',
        },
        billingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email || user?.email || '',
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
          country: 'India',
          addressType: 'home',
        },
        useShippingAsBilling: true,
        paymentMethod: paymentMethod as 'cod' | 'zoho_card' | 'zoho_upi' | 'zoho_netbanking' | 'zoho_wallet' | 'paytm',
      };

      const order = await api.createOrder(orderData);
      
      // Handle payment based on method
      if (paymentMethod === 'cod') {
        // COD orders go directly to success
        if (!directPurchase) {
          await clearCart();
        }
        
        toast({
          title: "Order Placed Successfully!",
          description: `Order ID: ${order.orderNumber}`,
        });
        
        navigate('/order-success', { 
          state: { 
            orderId: order._id,
            orderNumber: order.orderNumber,
            totalAmount: total,
            paymentMethod: 'cod'
          }
        });
      } else if (paymentMethod === 'paytm') {
        // Paytm payment gateway
        const paytmResponse = await api.paytm.createTransaction({ orderId: order._id });

        if (paytmResponse.success && paytmResponse.transaction.paymentUrl) {
          // Redirect to Paytm payment page (or mock page if in mock mode)
          window.location.href = paytmResponse.transaction.paymentUrl;
        } else {
          toast({
            title: "Payment Error",
            description: "Unable to initiate Paytm payment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // For Zoho online payments
        const paymentResponse = await api.createPaymentOrder({ orderId: order._id });

        // Redirect to Zoho payment page
        if (paymentResponse.success && paymentResponse.paymentOrder.paymentUrl) {
          window.location.href = paymentResponse.paymentOrder.paymentUrl;
        } else {
          toast({
            title: "Payment Error",
            description: "Unable to initiate payment. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Failed to place order",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!directPurchase && cartLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {directPurchase ? 'Quick Checkout' : 'Checkout'}
            </h1>
            <p className="text-muted-foreground">
              {directPurchase 
                ? 'Complete your purchase in just a few steps' 
                : 'Complete your order in just a few steps'
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest or Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Account Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={isGuest ? "guest" : "login"} onValueChange={(value) => setIsGuest(value === "guest")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="guest">Guest Checkout</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                      </TabsList>
                      <TabsContent value="guest" className="mt-4">
                        <div className="space-y-4">
                          <AnimatedInput
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="login" className="mt-4">
                        <div className="space-y-4">
                          <Input type="email" placeholder="Email" />
                          <Input type="password" placeholder="Password" />
                          <Button className="w-full">Login</Button>
                          <p className="text-sm text-muted-foreground text-center">
                            Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <AnimatedInput
                        id="firstName"
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                      <AnimatedInput
                        id="lastName"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                      <div className="md:col-span-2">
                        <AnimatedInput
                          id="phone"
                          label="Phone Number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 1234567890"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <AnimatedInput
                          id="address"
                          label="Address"
                          placeholder="Street address, apartment, suite, etc."
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          required
                        />
                      </div>
                      <AnimatedInput
                        id="city"
                        label="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                      <AnimatedInput
                        id="state"
                        label="State"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                      <AnimatedInput
                        id="pincode"
                        label="PIN Code"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        pattern="[0-9]{6}"
                        placeholder="123456"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>              {/* Payment Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                          </div>
                          <Badge variant="secondary">₹25 handling fee</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="zoho_upi" id="zoho_upi" />
                      <Label htmlFor="zoho_upi" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">UPI Payment</div>
                            <div className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, Paytm</div>
                          </div>
                          <Badge variant="outline">Instant</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="zoho_card" id="zoho_card" />
                      <Label htmlFor="zoho_card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                          </div>
                          <Badge variant="outline">Secure</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="zoho_netbanking" id="zoho_netbanking" />
                      <Label htmlFor="zoho_netbanking" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm text-muted-foreground">All major banks supported</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-blue-50">
                      <RadioGroupItem value="paytm" id="paytm" />
                      <Label htmlFor="paytm" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              Paytm Payment Gateway
                              <Badge variant="default" className="bg-blue-600">New</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">UPI, Cards, Wallet, Net Banking via Paytm</div>
                          </div>
                          <Badge variant="outline">All Methods</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="zoho_wallet" id="zoho_wallet" />
                      <Label htmlFor="zoho_wallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Digital Wallet</div>
                            <div className="text-sm text-muted-foreground">Amazon Pay, Mobikwik, Freecharge</div>
                          </div>
                          <Badge variant="outline">Quick</Badge>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items or Direct Purchase Item */}
                    {directPurchase && directProduct ? (
                      <motion.div
                        className="flex gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <img
                          src={getImageUrl(directProduct.images[0] || "/placeholder.svg")}
                          alt={directProduct.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{directProduct.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {directQuantity}</p>
                          <p className="text-sm font-medium">₹{(directProduct.price * directQuantity).toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ) : (
                      cart?.items.map((item, index) => (
                        <motion.div
                          key={item.productId.id}
                          className="flex gap-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        >
                          <img
                            src={getImageUrl(item.productId.images[0] || "/placeholder.svg")}
                            alt={item.productId.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.productId.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium">₹{(item.productId.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </motion.div>
                      ))
                    ) || []}

                    <Separator />

                    {/* Order Totals */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Shipping
                        </span>
                        <span>₹{shipping}</span>
                      </div>
                      {codFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>COD Handling Fee</span>
                          <span>₹{codFee}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </motion.div>

                    {/* Place Order Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          onClick={handlePlaceOrder}
                          className="w-full btn-hero mt-6"
                          size="lg"
                          disabled={isPlacingOrder}
                        >
                          {isPlacingOrder ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Placing Order...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="text-xs text-muted-foreground text-center mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                    >
                      By placing your order, you agree to our Terms of Service and Privacy Policy
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}