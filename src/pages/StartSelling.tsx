import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Users, Globe, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeObject, startSellingSchema, ClientRateLimiter, logEvent } from "@/lib/security";

export default function StartSelling() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    craftType: "",
    experience: "",
    description: "",
    socialMedia: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const limiter = new ClientRateLimiter(3, 60_000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limiter.allow("form:startSelling")) {
      toast({ title: "Too many submissions", description: "Please wait a minute and try again." });
      return;
    }
    const cleaned = sanitizeObject(formData);
    const parsed = startSellingSchema.safeParse(cleaned);
    if (!parsed.success) {
      toast({ title: "Please fix the form", description: parsed.error.errors[0]?.message ?? "Invalid input" });
      return;
    }
    logEvent({ level: "info", message: "StartSelling submitted" });
    toast({
      title: "Application Submitted!",
      description: "Redirecting to confirmation page...",
    });
    
    // Simulate form submission delay
    setTimeout(() => {
      navigate('/seller-success');
    }, 1500);
  };

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with customers worldwide and showcase your traditional crafts to an international audience."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access tools and analytics to help you understand your customers and grow your craft business."
    },
    {
      icon: Users,
      title: "Artisan Community",
      description: "Join a supportive network of fellow artisans and learn from shared experiences."
    },
    {
      icon: Star,
      title: "Quality Recognition",
      description: "Get recognized for your exceptional craftsmanship and build a reputation for quality."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Start Your Selling Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of artisans who are sharing their traditional crafts with the world and building sustainable businesses.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Sell With Zaymazone?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-muted hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Artisan Application</CardTitle>
              <CardDescription className="text-lg">
                Tell us about yourself and your craft. We're excited to learn about your story!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City, State) *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="craftType">Type of Craft *</Label>
                    <Input
                      id="craftType"
                      placeholder="e.g., Pottery, Textiles, Metalwork"
                      value={formData.craftType}
                      onChange={(e) => setFormData({...formData, craftType: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="1"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tell us about your craft and story *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your craft tradition, techniques, and what makes your work unique..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialMedia">Social Media or Website</Label>
                  <Input
                    id="socialMedia"
                    placeholder="Instagram, Facebook, or website URL"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">What happens next?</p>
                      <p>We'll review your application within 48 hours. If approved, you'll receive an email with setup instructions and access to your seller dashboard.</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full btn-hero">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}