import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, DollarSign, Users, Star, Handshake } from "lucide-react";

export default function SellerSuccess() {
  const nextSteps = [
    {
      icon: CheckCircle,
      title: "Application Submitted",
      description: "We've received your artisan application and will review it within 48 hours.",
      completed: true
    },
    {
      icon: Clock,
      title: "Review Process",
      description: "Our team will verify your craft credentials and story authenticity.",
      completed: false
    },
    {
      icon: Star,
      title: "Profile Setup",
      description: "Once approved, you'll set up your artisan profile and upload product photos.",
      completed: false
    },
    {
      icon: DollarSign,
      title: "Start Selling",
      description: "Begin listing your products and connecting with customers worldwide.",
      completed: false
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Global Customer Base",
      description: "Access to customers who appreciate authentic, handcrafted products."
    },
    {
      icon: Handshake,
      title: "Fair Trade Practices", 
      description: "We ensure artisans receive fair compensation for their work."
    },
    {
      icon: Star,
      title: "Quality Recognition",
      description: "Your craftsmanship gets the recognition it deserves."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome to the Zaymazone artisan community. We're excited to review your application.
            </p>
          </div>

          {/* Process Timeline */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
              <CardDescription>Follow your journey to becoming a verified Zaymazone artisan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-green-100' : 'bg-muted'
                    }`}>
                      <step.icon className={`w-5 h-5 ${
                        step.completed ? 'text-green-600' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        step.completed ? 'text-green-600' : 'text-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Questions About Your Application?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our artisan support team is here to help you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  Contact Support
                </Button>
                <Button asChild>
                  <a href="mailto:artisans@zaymazone.com">Email Us</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}