import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, AlertTriangle, Megaphone, Send, Users, Package } from "lucide-react";

export function AlertsAndAnnouncements() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    targetAudience: "all",
    priority: "normal"
  });

  // Mock data
  const alerts = [
    {
      id: 1,
      type: "system",
      title: "Server Maintenance",
      message: "Scheduled maintenance on January 20th, 2024 from 2-4 AM IST",
      severity: "info",
      active: true,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      type: "product",
      title: "Low Stock Alert",
      message: "5 products are running low on stock",
      severity: "warning",
      active: true,
      createdAt: "2024-01-14"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New Feature: Advanced Search",
      message: "We've launched an advanced search feature to help you find products faster!",
      targetAudience: "all",
      priority: "normal",
      status: "published",
      publishedAt: "2024-01-10",
      views: 1250
    },
    {
      id: 2,
      title: "Holiday Sale Extended",
      message: "Due to popular demand, our holiday sale has been extended by 3 days!",
      targetAudience: "customers",
      priority: "high",
      status: "published",
      publishedAt: "2024-01-08",
      views: 2100
    }
  ];

  const handleCreateAnnouncement = () => {
    // API call to create announcement
    console.log("Creating announcement:", newAnnouncement);
    setNewAnnouncement({ title: "", message: "", targetAudience: "all", priority: "normal" });
  };

  const handleToggleAlert = (alertId, currentStatus) => {
    // API call to toggle alert status
    console.log(`Toggling alert ${alertId} from ${currentStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Alerts & Announcements</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            System Alerts
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Manage system-wide alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{alert.type}</Badge>
                            <Badge variant={
                              alert.severity === 'high' ? 'destructive' :
                              alert.severity === 'warning' ? 'secondary' : 'outline'
                            }>
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{alert.createdAt}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleToggleAlert(alert.id, alert.active)}
                          >
                            {alert.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Create Announcement
                </CardTitle>
                <CardDescription>
                  Broadcast important messages to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    placeholder="Announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-message">Message</Label>
                  <Textarea
                    id="announcement-message"
                    placeholder="Announcement message"
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Audience</Label>
                    <Select
                      value={newAnnouncement.targetAudience}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, targetAudience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="customers">Customers Only</SelectItem>
                        <SelectItem value="artisans">Artisans Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={newAnnouncement.priority}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateAnnouncement} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Publish Announcement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Published announcements and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{announcement.targetAudience}</Badge>
                            <Badge variant={
                              announcement.priority === 'high' ? 'destructive' :
                              announcement.priority === 'normal' ? 'default' : 'secondary'
                            }>
                              {announcement.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{announcement.views} views</p>
                          <p>{announcement.publishedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}