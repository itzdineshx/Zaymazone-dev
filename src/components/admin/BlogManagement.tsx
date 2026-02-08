import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";
import { RichTextEditor } from "./RichTextEditor";
import { SingleImageUpload } from "./ImageUpload";
import { BlogPreview } from "./BlogPreview";
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MessageSquare,
  Heart,
  TrendingUp,
  Loader2,
  BookOpen,
  Tag,
  X
} from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  images: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
    role?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  readTime: string;
  publishedAt?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Traditional Crafts',
  'Textiles', 
  'Metal Crafts',
  'Pottery',
  'Sustainability',
  'Community Impact',
  'Innovation',
  'Business'
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' }
];

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTag, setNewTag] = useState("");
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [bulkOperation, setBulkOperation] = useState<string>("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  // Reload when search or filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadPosts();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterCategory, filterStatus]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getBlogPosts({
        limit: 50,
        search: searchTerm || undefined,
        category: filterCategory === "all" ? undefined : filterCategory,
        status: filterStatus === "all" ? undefined : filterStatus
      });
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast({
        title: "Error Loading Posts",
        description: "Failed to load blog posts. Please check your connection and try again.",
        variant: "destructive",
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newPost: Partial<BlogPost> = {
      _id: `post-${Date.now()}`,
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      images: [],
      author: {
        name: "",
        bio: "",
        avatar: "",
        role: "Writer"
      },
      category: categories[0],
      tags: [],
      status: 'draft',
      featured: false,
      readTime: "5 min read",
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingPost(newPost as BlogPost);
    setIsDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      setDeletingId(postId);
      await adminService.deleteBlogPost(postId);
      
      await loadPosts();
      
      toast({
        title: "Post Deleted",
        description: "The blog post has been removed successfully.",
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!editingPost) return;

    if (!editingPost.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Post title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!editingPost.excerpt.trim()) {
      toast({
        title: "Validation Error", 
        description: "Post excerpt is required.",
        variant: "destructive",
      });
      return;
    }

    if (!editingPost.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Post content is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const isNew = editingPost._id.startsWith('post-');
      
      const postData = {
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        featuredImage: editingPost.featuredImage,
        images: editingPost.images,
        author: editingPost.author,
        category: editingPost.category,
        tags: editingPost.tags,
        status: editingPost.status,
        featured: editingPost.featured,
        readTime: editingPost.readTime,
        seoTitle: editingPost.seoTitle,
        seoDescription: editingPost.seoDescription
      };

      if (isNew) {
        await adminService.createBlogPost(postData);
      } else {
        await adminService.updateBlogPost(editingPost._id, postData);
      }

      await loadPosts();

      setIsDialogOpen(false);
      setEditingPost(null);
      setNewTag("");

      toast({
        title: "Post Saved",
        description: `${editingPost.title} has been ${isNew ? 'created' : 'updated'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to save post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !editingPost) return;
    
    const trimmedTag = newTag.trim().toLowerCase();
    if (!editingPost.tags.includes(trimmedTag)) {
      setEditingPost({
        ...editingPost,
        tags: [...editingPost.tags, trimmedTag]
      });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      tags: editingPost.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSelectPost = (postId: string, selected: boolean) => {
    if (selected) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedPosts(filteredPosts.map(post => post._id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleBulkOperation = async (operation: string) => {
    if (selectedPosts.length === 0) {
      toast({
        title: "No posts selected",
        description: "Please select at least one post to perform bulk operations.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      switch (operation) {
        case 'delete':
          await Promise.all(selectedPosts.map(id => adminService.deleteBlogPost(id)));
          toast({
            title: "Posts Deleted",
            description: `${selectedPosts.length} posts have been deleted successfully.`,
          });
          break;

        case 'publish':
          await Promise.all(selectedPosts.map(id => 
            adminService.updateBlogPost(id, { status: 'published' })
          ));
          toast({
            title: "Posts Published",
            description: `${selectedPosts.length} posts have been published successfully.`,
          });
          break;

        case 'draft':
          await Promise.all(selectedPosts.map(id => 
            adminService.updateBlogPost(id, { status: 'draft' })
          ));
          toast({
            title: "Posts Moved to Draft",
            description: `${selectedPosts.length} posts have been moved to draft.`,
          });
          break;

        case 'feature':
          await Promise.all(selectedPosts.map(id => 
            adminService.updateBlogPost(id, { featured: true })
          ));
          toast({
            title: "Posts Featured",
            description: `${selectedPosts.length} posts have been marked as featured.`,
          });
          break;

        case 'unfeature':
          await Promise.all(selectedPosts.map(id => 
            adminService.updateBlogPost(id, { featured: false })
          ));
          toast({
            title: "Posts Unfeatured",
            description: `${selectedPosts.length} posts have been unmarked as featured.`,
          });
          break;

        default:
          toast({
            title: "Unknown Operation",
            description: "The selected operation is not supported.",
            variant: "destructive",
          });
          return;
      }

      await loadPosts();
      setSelectedPosts([]);
      setShowBulkActions(false);

    } catch (error) {
      console.error('Bulk operation failed:', error);
      toast({
        title: "Bulk Operation Failed",
        description: error instanceof Error ? error.message : "Failed to perform bulk operation.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published": return "default";
      case "draft": return "secondary";
      default: return "outline";
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage blog posts and articles
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search posts..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          onClick={() => setShowBulkActions(!showBulkActions)}
          className="whitespace-nowrap"
        >
          Bulk Actions
        </Button>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedPosts.length === 0 
                    ? "Select posts for bulk operations"
                    : `${selectedPosts.length} post${selectedPosts.length === 1 ? '' : 's'} selected`
                  }
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBulkActions(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedPosts.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkOperation('publish')}
                  disabled={saving}
                >
                  Publish Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkOperation('draft')}
                  disabled={saving}
                >
                  Move to Draft
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkOperation('feature')}
                  disabled={saving}
                >
                  Mark as Featured
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkOperation('unfeature')}
                  disabled={saving}
                >
                  Remove Featured
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkOperation('delete')}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 mr-1" />
                  )}
                  Delete Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <div className="grid gap-4">
        {filteredPosts.map((post) => (
          <Card key={post._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {showBulkActions && (
                  <Checkbox
                    checked={selectedPosts.includes(post._id)}
                    onCheckedChange={(checked) => handleSelectPost(post._id, !!checked)}
                    className="mt-1"
                  />
                )}
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={getStatusVariant(post.status)}>
                        {post.status}
                      </Badge>
                      {post.featured && <Badge variant="outline">Featured</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Not published"}</span>
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewPost(post)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                  >
                    {deletingId === post._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterCategory !== "all" || filterStatus !== "all" 
                  ? "Try adjusting your search criteria or filters." 
                  : "Get started by creating your first blog post."}
              </p>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Blog Post Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost?._id.startsWith('post-') ? 'Create New Post' : 'Edit Post'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingPost?._id.startsWith('post-') ? 'create' : 'update'} the blog post.
            </DialogDescription>
          </DialogHeader>
          
          {editingPost && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="excerpt" className="text-right">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                  className="col-span-3"
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">Content</Label>
                <div className="col-span-3">
                  <RichTextEditor
                    value={editingPost.content}
                    onChange={(content) => setEditingPost({...editingPost, content})}
                    placeholder="Write your blog post content here..."
                    height={400}
                    showPreview={true}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="featuredImage" className="text-right pt-2">Featured Image</Label>
                <div className="col-span-3">
                  <SingleImageUpload
                    value={editingPost.featuredImage}
                    onChange={(url) => setEditingPost({...editingPost, featuredImage: url})}
                    placeholder="Upload featured image for the blog post"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="authorName" className="text-right">Author Name</Label>
                <Input
                  id="authorName"
                  value={editingPost.author.name}
                  onChange={(e) => setEditingPost({
                    ...editingPost, 
                    author: {...editingPost.author, name: e.target.value}
                  })}
                  className="col-span-3"
                  placeholder="Author's full name"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="authorBio" className="text-right">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  value={editingPost.author.bio || ''}
                  onChange={(e) => setEditingPost({
                    ...editingPost, 
                    author: {...editingPost.author, bio: e.target.value}
                  })}
                  className="col-span-3"
                  placeholder="Brief author biography..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select 
                  value={editingPost.category} 
                  onValueChange={(value) => setEditingPost({...editingPost, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Tags</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {editingPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select 
                  value={editingPost.status} 
                  onValueChange={(value: 'draft' | 'published') => setEditingPost({...editingPost, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="readTime" className="text-right">Read Time</Label>
                <Input
                  id="readTime"
                  value={editingPost.readTime}
                  onChange={(e) => setEditingPost({...editingPost, readTime: e.target.value})}
                  className="col-span-3"
                  placeholder="5 min read"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Featured</Label>
                <div className="col-span-3">
                  <Checkbox
                    checked={editingPost.featured}
                    onCheckedChange={(checked) => setEditingPost({...editingPost, featured: !!checked})}
                  />
                  <Label className="ml-2 text-sm">Mark as featured post</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {editingPost && (
              <Button 
                variant="secondary" 
                onClick={() => setPreviewPost(editingPost)}
                disabled={saving}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Post</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">All blog posts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(p => p.status === 'published').length}
            </div>
            <p className="text-xs text-muted-foreground">Live posts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.length > 0 ? Math.round(posts.reduce((acc, p) => acc + p.likes + p.comments, 0) / posts.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Likes + comments per post</p>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {previewPost && (
        <BlogPreview 
          post={previewPost} 
          onClose={() => setPreviewPost(null)} 
        />
      )}
    </div>
  );
}