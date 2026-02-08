import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Eye,
  Download,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";

// Order interface for type safety
interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: string;
  status: "Delivered" | "Shipped" | "Processing" | "Pending" | "Cancelled";
  payment: "Paid" | "Failed" | "Refunded" | "Pending";
  date: string;
  deliveryDate: string | null;
  artisan: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: Replace with actual API call to fetch orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const response = await fetch('/api/admin/orders', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      //   }
      // });
      // const data = await response.json();
      // setOrders(data.orders || []);
      
      // For now, set empty array
      setOrders([]);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Shipped": return "secondary";
      case "Processing": return "outline";
      case "Pending": return "secondary";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="w-3 h-3" />;
      case "Shipped": return <Truck className="w-3 h-3" />;
      case "Processing": return <Package className="w-3 h-3" />;
      case "Pending": return <Clock className="w-3 h-3" />;
      case "Cancelled": return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getPaymentVariant = (payment: string) => {
    switch (payment) {
      case "Paid": return "default";
      case "Failed": return "destructive";
      case "Refunded": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Track and manage customer orders</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Orders Found</h3>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers place them
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-foreground">{order.id}</h3>
                    <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                    <Badge variant={getPaymentVariant(order.payment)}>
                      {order.payment}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p>{order.email}</p>
                    </div>
                    
                    <div>
                      <p><span className="font-medium">Items:</span> {order.items}</p>
                      <p><span className="font-medium">Artisan:</span> {order.artisan}</p>
                    </div>
                    
                    <div>
                      <p><span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                      {order.deliveryDate && (
                        <p><span className="font-medium">Delivery:</span> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-semibold text-foreground text-lg">{order.total}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}