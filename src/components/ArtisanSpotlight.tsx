import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";

const featuredArtisans = [
  {
    id: 1,
    name: "Maya Sharma",
    craft: "Ceramic Potter",
    location: "Rajasthan, India",
    experience: "15+ years",
    rating: 4.9,
    speciality: "Blue Pottery",
    image: "/assets/artisan-1.jpg",
    description: "Master of traditional Rajasthani blue pottery with intricate hand-painted designs passed down through generations.",
    products: 24,
    achievements: ["UNESCO Recognition", "National Award Winner"]
  },
  {
    id: 2,
    name: "Arjun Patel",
    craft: "Brass Artisan",
    location: "Gujarat, India",
    experience: "20+ years",
    rating: 4.8,
    speciality: "Temple Ornaments",
    image: "/assets/artisan-2.jpg",
    description: "Renowned for creating exquisite brass temple ornaments and decorative pieces using ancient casting techniques.",
    products: 18,
    achievements: ["Heritage Craftsman", "Export Excellence"]
  },
  {
    id: 3,
    name: "Priya Devi",
    craft: "Textile Weaver",
    location: "Kashmir, India",
    experience: "12+ years",
    rating: 4.9,
    speciality: "Kashmiri Shawls",
    image: "/assets/artisan-3.jpg",
    description: "Expert in weaving luxurious Kashmiri shawls with traditional patterns and premium pashmina wool.",
    products: 31,
    achievements: ["Master Weaver", "Cultural Heritage Award"]
  }
];

export const ArtisanSpotlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArtisans.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextArtisan = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArtisans.length);
    setIsAutoPlaying(false);
  };

  const prevArtisan = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredArtisans.length) % featuredArtisans.length);
    setIsAutoPlaying(false);
  };

  const currentArtisan = featuredArtisans[currentIndex];

  return (
    <section className="relative py-16 bg-gradient-subtle dark:bg-gradient-to-br dark:from-background/98 dark:via-background/95 dark:to-primary/5 overflow-hidden">
      {/* Artisan spotlight dark mode enhancement */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.01] via-transparent to-primary-glow/[0.02] dark:from-primary/[0.02] dark:via-transparent dark:to-primary-glow/[0.04] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            Artisan Spotlight
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Meet Our Master Craftspeople
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the stories and skills behind each handcrafted piece
          </p>
        </div>

        <div className="relative">
          <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-500">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-96 lg:h-auto overflow-hidden">
                  <img
                    src={currentArtisan.image}
                    alt={currentArtisan.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{currentArtisan.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{currentArtisan.rating} rating</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {currentArtisan.name}
                    </h3>
                    <p className="text-xl text-primary font-medium mb-2">
                      {currentArtisan.craft}
                    </p>
                    <Badge variant="outline" className="mb-4">
                      {currentArtisan.speciality}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {currentArtisan.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-card rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {currentArtisan.experience}
                      </div>
                      <div className="text-sm text-muted-foreground">Experience</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {currentArtisan.products}
                      </div>
                      <div className="text-sm text-muted-foreground">Products</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentArtisan.achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button asChild className="btn-hero flex-1">
                      <Link to="/artisans">View Profile</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/shop">View Products</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevArtisan}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {featuredArtisans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  aria-label={`Go to artisan ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextArtisan}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};