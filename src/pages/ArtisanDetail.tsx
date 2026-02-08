import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCard } from "@/components/ProductCard";
import { getImageUrl } from "@/lib/api";
import { 
  MapPin, 
  Star, 
  Users, 
  Award, 
  Calendar,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  MessageCircle,
  Package,
  Verified,
  Clock,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Artisan {
  id: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  bio: string;
  specialization: string[];
  yearsOfExperience: number;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  joinedDate: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  achievements: Array<{
    title: string;
    description: string;
    year: number;
  }>;
  story: string;
  techniques: string[];
  materials: string[];
}

interface ArtisanProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  subcategory: string;
  materials: string[];
  dimensions: string;
  weight: string;
  colors: string[];
  stockCount: number;
  rating: number;
  reviewCount: number;
  isHandmade: boolean;
  shippingTime: string;
  inStock: boolean;
  artisan: {
    id: string;
    name: string;
    location: string;
    bio: string;
    avatar: string;
    rating: number;
    totalProducts: number;
  };
  tags: string[];
  featured: boolean;
}

export default function ArtisanDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<ArtisanProduct[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      loadArtisanData();
    }
  }, [id]);

  const loadArtisanData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockArtisan: Artisan = {
        id: id!,
        name: "Meera Devi",
        avatar: getImageUrl('artisan-avatar-1.jpg'),
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop",
        location: {
          city: "Srinagar",
          state: "Kashmir",
          country: "India"
        },
        bio: "Master craftsperson specializing in traditional Kashmiri shawls and textiles. Passionate about preserving ancient weaving techniques passed down through generations.",
        specialization: ["Kashmiri Shawls", "Pashmina", "Traditional Weaving"],
        yearsOfExperience: 25,
        isVerified: true,
        rating: 4.8,
        totalReviews: 156,
        totalProducts: 42,
        joinedDate: "2019-03-15",
        contact: {
          phone: "+91 9876543210",
          email: "meera@kashmiricrafts.com",
          website: "www.kashmiricrafts.com"
        },
        socialMedia: {
          facebook: "facebook.com/meeracrafts",
          instagram: "@meera_kashmiri_crafts"
        },
        achievements: [
          {
            title: "UNESCO Craft Excellence Award",
            description: "Recognized for exceptional contribution to traditional crafts",
            year: 2022
          },
          {
            title: "National Handicrafts Award",
            description: "Government of India recognition for master craftsperson",
            year: 2020
          }
        ],
        story: "Born into a family of weavers in the heart of Kashmir, Meera learned the art of Pashmina weaving from her grandmother. Over 25 years, she has mastered traditional techniques while innovating contemporary designs that appeal to modern customers. Her work represents the perfect blend of heritage and contemporary aesthetics.",
        techniques: ["Hand Spinning", "Traditional Loom Weaving", "Natural Dyeing", "Embroidery"],
        materials: ["Pashmina Wool", "Silk", "Natural Dyes", "Traditional Threads"]
      };

      const mockProducts: ArtisanProduct[] = [
        {
          id: "1",
          name: "Handwoven Kashmiri Shawl",
          price: 4500,
          originalPrice: 5200,
          images: [
            "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop"
          ],
          description: "Exquisite handwoven Kashmiri shawl made with traditional techniques passed down through generations",
          category: "Textiles",
          subcategory: "Shawls",
          materials: ["Pashmina Wool", "Natural Dyes"],
          dimensions: "200cm x 70cm x 1cm",
          weight: "200g",
          colors: ["Beige", "Brown", "Gold"],
          stockCount: 5,
          rating: 4.9,
          reviewCount: 45,
          isHandmade: true,
          shippingTime: "7-10 days",
          inStock: true,
          artisan: { 
            id: id!, 
            name: mockArtisan.name, 
            location: `${mockArtisan.location.city}, ${mockArtisan.location.state}`,
            bio: mockArtisan.bio,
            avatar: mockArtisan.avatar,
            rating: mockArtisan.rating,
            totalProducts: mockArtisan.totalProducts
          },
          tags: ["handmade", "kashmiri", "shawl", "pashmina"],
          featured: true
        },
        {
          id: "2",
          name: "Pure Pashmina Stole",
          price: 6200,
          originalPrice: 7000,
          images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
          ],
          description: "Luxurious pure Pashmina stole with intricate hand embroidery and fine craftsmanship",
          category: "Textiles",
          subcategory: "Stoles",
          materials: ["Pure Pashmina", "Silk Thread"],
          dimensions: "180cm x 60cm x 1cm",
          weight: "150g",
          colors: ["Cream", "Gold", "Rose"],
          stockCount: 3,
          rating: 4.8,
          reviewCount: 32,
          isHandmade: true,
          shippingTime: "10-14 days",
          inStock: true,
          artisan: { 
            id: id!, 
            name: mockArtisan.name, 
            location: `${mockArtisan.location.city}, ${mockArtisan.location.state}`,
            bio: mockArtisan.bio,
            avatar: mockArtisan.avatar,
            rating: mockArtisan.rating,
            totalProducts: mockArtisan.totalProducts
          },
          tags: ["handmade", "pashmina", "stole", "luxury"],
          featured: true
        },
        {
          id: "3",
          name: "Embroidered Wool Scarf",
          price: 2800,
          images: [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop"
          ],
          description: "Beautifully embroidered wool scarf featuring traditional Kashmiri motifs and patterns",
          category: "Textiles",
          subcategory: "Scarves",
          materials: ["Wool", "Cotton Thread", "Natural Dyes"],
          dimensions: "160cm x 40cm x 1cm",
          weight: "120g",
          colors: ["Blue", "White", "Silver"],
          stockCount: 0,
          rating: 4.7,
          reviewCount: 28,
          isHandmade: true,
          shippingTime: "5-7 days",
          inStock: false,
          artisan: { 
            id: id!, 
            name: mockArtisan.name, 
            location: `${mockArtisan.location.city}, ${mockArtisan.location.state}`,
            bio: mockArtisan.bio,
            avatar: mockArtisan.avatar,
            rating: mockArtisan.rating,
            totalProducts: mockArtisan.totalProducts
          },
          tags: ["handmade", "embroidered", "scarf", "wool"],
          featured: false
        }
      ];

      setArtisan(mockArtisan);
      setProducts(mockProducts);
      setReviews([]);
    } catch (error) {
      toast({
        title: "Error loading artisan",
        description: "Failed to load artisan information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `Unfollowed ${artisan?.name}` : `Now following ${artisan?.name}`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Artisan profile link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Loading artisan profile...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artisan not found</h2>
            <p className="text-muted-foreground mb-6">The artisan you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/artisans">Browse All Artisans</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Cover Image & Header */}
        <div className="relative h-80 bg-gradient-to-r from-primary/20 to-secondary/20 overflow-hidden">
          {artisan.coverImage && (
            <img 
              src={artisan.coverImage} 
              alt={artisan.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Navigation Breadcrumb */}
          <div className="absolute top-6 left-6 z-10">
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
              <Link to="/artisans">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Artisans
              </Link>
            </Button>
          </div>

          {/* Artisan Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="flex items-end gap-6">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={artisan.avatar} alt={artisan.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {artisan.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-white">{artisan.name}</h1>
                  {artisan.isVerified && (
                    <Verified className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-white/90 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{artisan.location.city}, {artisan.location.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{artisan.rating}</span>
                    <span>({artisan.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{artisan.yearsOfExperience} years experience</span>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm max-w-2xl">{artisan.bio}</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant={isFollowing ? "secondary" : "default"} 
                  onClick={handleFollow}
                  className="min-w-[100px]"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share artisan profile">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Send message">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{artisan.totalProducts}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{artisan.rating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{artisan.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{artisan.yearsOfExperience}</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products yet</h3>
                  <p className="text-muted-foreground">This artisan hasn't listed any products yet.</p>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Story */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Artisan Story</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{artisan.story}</p>
                    </CardContent>
                  </Card>

                  {/* Techniques & Materials */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Techniques</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {artisan.techniques.map((technique) => (
                            <Badge key={technique} variant="secondary">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Materials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {artisan.materials.map((material) => (
                            <Badge key={material} variant="outline">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {artisan.achievements.map((achievement, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{achievement.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Specializations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {artisan.specialization.map((spec) => (
                          <Badge key={spec} className="mr-2 mb-2">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-medium">{artisan.yearsOfExperience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">
                          {new Date(artisan.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{artisan.location.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Products</span>
                        <span className="font-medium">{artisan.totalProducts}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">Be the first to review this artisan's work!</p>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {artisan.contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{artisan.contact.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {artisan.contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{artisan.contact.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {artisan.contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a 
                            href={`https://${artisan.contact.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {artisan.contact.website}
                          </a>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <p className="font-medium">Social Media</p>
                      <div className="flex gap-2">
                        {artisan.socialMedia.facebook && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://${artisan.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
                              Facebook
                            </a>
                          </Button>
                        )}
                        {artisan.socialMedia.instagram && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://${artisan.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer">
                              Instagram
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Send Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md" 
                          placeholder="Enter subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea 
                          rows={4}
                          className="w-full p-2 border rounded-md" 
                          placeholder="Type your message here..."
                        />
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}