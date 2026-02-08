import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Phone, Mail, Globe } from "lucide-react";
import { getImageUrl } from "@/lib/api";

export function ProfileManagement() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Artisan Profile</CardTitle>
          <CardDescription>Update your public artisan profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={getImageUrl('artisan-avatar-1.jpg')} />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0" aria-label="Change profile picture">
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Renu Kumari</h3>
              <p className="text-sm text-muted-foreground">Traditional Potter</p>
              <Badge variant="secondary" className="mt-1">Verified Artisan</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Renu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Kumari" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell your story..."
              defaultValue="I am a traditional potter from Rajasthan with over 20 years of experience in creating beautiful blue pottery. My family has been in this craft for generations, and I specialize in creating unique tea sets, bowls, and decorative items using traditional techniques passed down through my ancestors."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Jaipur, Rajasthan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" defaultValue="Blue Pottery, Traditional Ceramics" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="renu.potter@example.com" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profile Views</span>
              <span className="font-semibold">1,249</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profile Rating</span>
              <span className="font-semibold">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Years Experience</span>
              <span className="font-semibold">20+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Completed Orders</span>
              <span className="font-semibold">247</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Jaipur, Rajasthan, India</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>renu.potter@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>www.renupottery.com</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}