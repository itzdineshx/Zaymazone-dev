import { useLocation, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || "ORDER123";
  const totalAmount = location.state?.totalAmount || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Total Amount:</strong> ₹{totalAmount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
