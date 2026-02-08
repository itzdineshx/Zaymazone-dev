import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, X, Calendar, Clock, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  date: string;
  readTime: string;
  image: string;
  likes: number;
  comments: number;
  featured: boolean;
  tags?: string[];
}

interface BlogSearchProps {
  posts: BlogPost[];
  categories: string[];
  onFilterChange?: (filteredPosts: BlogPost[]) => void;
}

export const BlogSearch = ({ posts, categories, onFilterChange }: BlogSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory]);

  // Notify parent component of filtered results
  useEffect(() => {
    onFilterChange?.(filteredPosts);
  }, [filteredPosts, onFilterChange]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== "All";

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search articles, authors, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Filter Actions */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Clear filters
            </Button>
          )}
          <Badge variant="secondary" className="px-2 py-1">
            {filteredPosts.length} articles
          </Badge>
        </div>
      </div>

      {/* Search Results Preview */}
      {searchQuery.trim() && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium text-foreground mb-3">
            Search Results for "{searchQuery}"
          </h4>
          {filteredPosts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No articles found. Try adjusting your search terms or clearing filters.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="block group"
                >
                  <div className="flex items-start gap-3 p-2 rounded hover:bg-background/50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-muted rounded overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </h5>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {filteredPosts.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  and {filteredPosts.length - 3} more articles...
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};