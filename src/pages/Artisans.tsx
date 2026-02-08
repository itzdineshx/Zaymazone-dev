import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArtisanProfile } from "@/components/ArtisanProfile";
import { Button } from "@/components/ui/button";
import { useArtisans } from "@/hooks/useArtisans";
import { Loader2 } from "lucide-react";
import { pageContentApi } from "@/services/api";
import { useState, useEffect } from "react";

const Artisans = () => {
  const { data: artisans, isLoading, error } = useArtisans();
  const [pageContent, setPageContent] = useState({ 
    title: "Meet Our Artisans", 
    description: "Discover the talented craftspeople behind our beautiful products. Each artisan brings decades of experience and passion to their craft, preserving ancient traditions while creating contemporary masterpieces." 
  });

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const content = await pageContentApi.getPageContent('artisans');
        setPageContent(content);
      } catch (error) {
        console.warn('Failed to fetch artisans page content:', error);
        // Keep default content
      }
    };

    fetchPageContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load artisans</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{pageContent.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {pageContent.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{artisans?.length || 0}+</div>
            <div className="text-sm text-muted-foreground">Skilled Artisans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">28</div>
            <div className="text-sm text-muted-foreground">States Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Traditional Crafts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100K+</div>
            <div className="text-sm text-muted-foreground">Products Sold</div>
          </div>
        </div>

        {/* Artisan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans?.map((artisan) => (
            <ArtisanProfile key={artisan.id} artisan={artisan} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Artisan Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Are you a skilled craftsperson? Partner with us to showcase your work to thousands of appreciative customers.
          </p>
          <Button size="lg">Apply Now</Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Artisans;
