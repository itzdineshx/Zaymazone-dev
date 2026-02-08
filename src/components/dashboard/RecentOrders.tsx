import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Order {
  id: string;
  product: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

const recentOrders: Order[] = [
  { 
    id: "#ORD-001", 
    product: "Blue Pottery Bowl", 
    customer: "Sarah Chen", 
    amount: "$89", 
    status: "Shipped",
    date: "2024-01-15"
  },
  { 
    id: "#ORD-002", 
    product: "Kashmiri Shawl", 
    customer: "Michael Roberts", 
    amount: "$245", 
    status: "Processing",
    date: "2024-01-14"
  },
  { 
    id: "#ORD-003", 
    product: "Copper Water Bottle", 
    customer: "Emma Wilson", 
    amount: "$65", 
    status: "Delivered",
    date: "2024-01-13"
  },
  { 
    id: "#ORD-004", 
    product: "Jute Shopping Bag", 
    customer: "David Kim", 
    amount: "$28", 
    status: "Pending",
    date: "2024-01-12"
  }
];

export function RecentOrders() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Shipped": return "secondary";
      case "Processing": return "outline";
      case "Pending": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest customer orders</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <p className="text-sm text-muted-foreground">{order.product}</p>
                <p className="text-sm text-muted-foreground">by {order.customer}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-foreground">{order.amount}</p>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}