import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  Recycle, 
  Globe, 
  Users, 
  Heart, 
  TreePine,
  Droplets,
  Wind,
  Handshake,
  Award,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const Sustainability = () => {
  const initiatives = [
    {
      icon: Leaf,
      title: "Eco-Friendly Materials",
      description: "Supporting artisans who use sustainable, locally-sourced materials",
      impact: "95% of our products use natural, biodegradable materials",
      progress: 95
    },
    {
      icon: Recycle,
      title: "Zero Waste Packaging",
      description: "Recyclable and minimal packaging for all shipments",
      impact: "Reduced packaging waste by 80% since 2022",
      progress: 80
    },
    {
      icon: TreePine,
      title: "Carbon Neutral Shipping",
      description: "Offsetting shipping emissions through tree planting initiatives",
      impact: "10,000+ trees planted through our carbon offset program",
      progress: 100
    },
    {
      icon: Users,
      title: "Artisan Empowerment",
      description: "Fair trade practices and direct payments to artisan communities",
      impact: "Supporting 500+ artisan families across India",
      progress: 88
    }
  ];

  const goals = [
    {
      year: "2024",
      title: "Carbon Neutral Operations",
      description: "Achieve complete carbon neutrality across all operations",
      status: "In Progress",
      completion: 75
    },
    {
      year: "2025",
      title: "100% Sustainable Materials",
      description: "Ensure all products use only sustainable, eco-friendly materials",
      status: "On Track",
      completion: 45
    },
    {
      year: "2026",
      title: "Circular Economy Model",
      description: "Implement product take-back and recycling programs",
      status: "Planning",
      completion: 15
    }
  ];

  const certifications = [
    {
      name: "Fair Trade Certified",
      description: "Ensuring fair wages and working conditions for all artisans",
      icon: Handshake
    },
    {
      name: "Sustainable Packaging Alliance",
      description: "Member of global initiative for responsible packaging",
      icon: Recycle
    },
    {
      name: "Carbon Trust Standard",
      description: "Verified carbon footprint measurement and reduction",
      icon: Leaf
    },
    {
      name: "B Corporation Pending",
      description: "Pursuing certification for social and environmental performance",
      icon: Award
    }
  ];

  const impactStats = [
    { label: "CO2 Emissions Saved", value: "12.5 tons", icon: Wind },
    { label: "Water Conservation", value: "50,000L", icon: Droplets },
    { label: "Artisan Families Supported", value: "500+", icon: Users },
    { label: "Sustainable Products", value: "95%", icon: Leaf }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Leaf className="w-3 h-3 mr-1" />
                Sustainability Report 2024
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Crafting a <span className="text-green-600">Sustainable</span> Future
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Our commitment to environmental responsibility and social impact goes beyond business. 
                We're building a platform that preserves traditional crafts while protecting our planet 
                and empowering artisan communities.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <IconComponent className="w-8 h-8 text-green-600 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Initiatives Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Sustainability Initiatives</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Every aspect of our business is designed with sustainability in mind, from the materials 
                our artisans use to how we deliver products to your door.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {initiatives.map((initiative, index) => {
                const IconComponent = initiative.icon;
                return (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{initiative.title}</CardTitle>
                          <CardDescription className="mt-2">{initiative.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Progress</span>
                            <span className="text-sm font-semibold text-foreground">{initiative.progress}%</span>
                          </div>
                          <Progress value={initiative.progress} className="h-2" />
                        </div>
                        <p className="text-sm text-green-600 font-medium">{initiative.impact}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Goals & Roadmap */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Sustainability Roadmap</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We've set ambitious but achievable goals for the coming years to create lasting positive impact.
              </p>
            </div>

            <div className="space-y-6">
              {goals.map((goal, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
                          {goal.year}
                        </Badge>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{goal.title}</h3>
                          <p className="text-muted-foreground">{goal.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={goal.status === "In Progress" ? "default" : goal.status === "On Track" ? "secondary" : "outline"}
                      >
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={goal.completion} className="flex-1 h-3" />
                      <span className="text-sm font-semibold text-foreground min-w-[3rem]">
                        {goal.completion}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Certifications & Partnerships</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We work with leading organizations to ensure our sustainability claims are verified and impactful.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <IconComponent className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Sustainability Mission</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Every purchase you make supports sustainable practices and empowers artisan communities. 
              Together, we can preserve traditional crafts while protecting our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/shop">
                  <Heart className="w-5 h-5 mr-2" />
                  Shop Sustainable Crafts
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link to="/artisans">
                  <Users className="w-5 h-5 mr-2" />
                  Meet Our Artisans
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Report Download */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Download Our Full Sustainability Report</CardTitle>
                <CardDescription>
                  Get detailed insights into our environmental impact, social initiatives, and future commitments.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">50+</div>
                    <div className="text-sm text-muted-foreground">Pages of insights</div>
                  </div>
                  <div>
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">15</div>
                    <div className="text-sm text-muted-foreground">Key performance indicators</div>
                  </div>
                  <div>
                    <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground">Years of data analysis</div>
                  </div>
                </div>
                <Button size="lg">
                  Download Report (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sustainability;