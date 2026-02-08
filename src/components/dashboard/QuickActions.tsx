import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  Camera,
  BarChart3,
  Settings,
  Package,
  MessageSquare
} from "lucide-react";

export function QuickActions() {
  const actions = [
    { icon: Plus, label: "Add New Product", variant: "default" as const },
    { icon: Camera, label: "Upload Photos", variant: "outline" as const },
    { icon: Package, label: "Manage Inventory", variant: "outline" as const },
    { icon: BarChart3, label: "View Analytics", variant: "outline" as const },
    { icon: MessageSquare, label: "Customer Messages", variant: "outline" as const },
    { icon: Settings, label: "Update Profile", variant: "outline" as const }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button 
            key={index}
            className="w-full justify-start" 
            variant={action.variant}
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}