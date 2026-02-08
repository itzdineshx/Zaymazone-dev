import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";
import { 
  MessageSquare,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Filter,
  MoreHorizontal,
  Loader2,
  Flag,
  Reply,
  Clock,
  ThumbsUp,
  ThumbsDown,
  X
} from "lucide-react";

interface Comment {
  _id: string;
  postId: {
    _id: string;
    title: string;
    slug: string;
    category: string;
    featured: boolean;
  };
  author: {
    name: string;
    email: string;
    avatar?: string;
    website?: string;
  };
  content: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likes: number;
  dislikes: number;
  reports: number;
  ipAddress?: string;
  userAgent?: string;
  moderatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  moderatedAt?: string;
  moderationReason?: string;
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
  replies?: Comment[];
}

const statusOptions = [
  { value: 'all', label: 'All Comments', icon: MessageSquare },
  { value: 'pending', label: 'Pending Review', icon: Clock },
  { value: 'approved', label: 'Approved', icon: CheckCircle },
  { value: 'rejected', label: 'Rejected', icon: XCircle },
  { value: 'spam', label: 'Spam', icon: AlertTriangle },
];

export function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [viewingComment, setViewingComment] = useState<Comment | null>(null);
  const [moderationDialog, setModerationDialog] = useState<{
    open: boolean;
    comment: Comment | null;
    action: 'approve' | 'reject' | 'spam' | null;
  }>({ open: false, comment: null, action: null });
  
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [postFilter, setPostFilter] = useState("all");
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0
  });
  
  const [moderationReason, setModerationReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadComments();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, postFilter]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getComments({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
        limit: 50,
        skip: 0
      });
      
      setComments(data.comments || []);
      setCounts(data.counts || { pending: 0, approved: 0, rejected: 0, spam: 0 });
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast({
        title: "Error Loading Comments",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      });
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComment = (commentId: string, selected: boolean) => {
    if (selected) {
      setSelectedComments(prev => [...prev, commentId]);
    } else {
      setSelectedComments(prev => prev.filter(id => id !== commentId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedComments(comments.map(comment => comment._id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleModerateComment = async (commentId: string, action: 'approved' | 'rejected' | 'spam', reason = '') => {
    try {
      setModerating(true);
      await adminService.moderateComment(commentId, { status: action, reason });
      
      await loadComments();
      setSelectedComments([]);
      
      toast({
        title: "Comment Moderated",
        description: `Comment has been ${action} successfully.`,
      });
    } catch (error) {
      console.error('Failed to moderate comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to moderate comment.",
        variant: "destructive",
      });
    } finally {
      setModerating(false);
    }
  };

  const handleBulkModeration = async (action: 'approved' | 'rejected' | 'spam') => {
    if (selectedComments.length === 0) return;

    try {
      setModerating(true);
      await adminService.bulkModerateComments({
        commentIds: selectedComments,
        status: action,
        reason: moderationReason
      });
      
      await loadComments();
      setSelectedComments([]);
      setModerationReason("");
      
      toast({
        title: "Comments Moderated",
        description: `${selectedComments.length} comments have been ${action}.`,
      });
    } catch (error) {
      console.error('Failed to bulk moderate:', error);
      toast({
        title: "Error",
        description: "Failed to moderate comments.",
        variant: "destructive",
      });
    } finally {
      setModerating(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeleting(commentId);
      await adminService.deleteComment(commentId);
      
      await loadComments();
      
      toast({
        title: "Comment Deleted",
        description: "The comment has been permanently deleted.",
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'spam': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      case 'spam': return AlertTriangle;
      default: return MessageSquare;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <h2 className="text-2xl font-bold tracking-tight">Comment Management</h2>
          <p className="text-muted-foreground">
            Moderate and manage blog comments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => {
          const Icon = status.icon;
          const count = counts[status.value as keyof typeof counts] || 0;
          
          return (
            <Card key={status.value} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setStatusFilter(status.value)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {status.label}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search comments..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedComments.length === comments.length && comments.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedComments.length === 0 
                    ? "Select comments for bulk operations"
                    : `${selectedComments.length} comment${selectedComments.length === 1 ? '' : 's'} selected`
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
            
            {selectedComments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Moderation reason (optional)"
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkModeration('approved')}
                    disabled={moderating}
                    className="text-green-600"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkModeration('rejected')}
                    disabled={moderating}
                    className="text-red-600"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkModeration('spam')}
                    disabled={moderating}
                    className="text-orange-600"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Mark as Spam
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const StatusIcon = getStatusIcon(comment.status);
          
          return (
            <Card key={comment._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {showBulkActions && (
                    <Checkbox
                      checked={selectedComments.includes(comment._id)}
                      onCheckedChange={(checked) => handleSelectComment(comment._id, !!checked)}
                      className="mt-1"
                    />
                  )}

                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{comment.author.name}</h4>
                          <Badge variant={getStatusVariant(comment.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {comment.status}
                          </Badge>
                          {comment.parentId && (
                            <Badge variant="outline" className="text-xs">
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {comment.author.email}
                        </p>
                        
                        <p className="text-sm mb-3 line-clamp-3">
                          {comment.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(comment.createdAt)}
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            on "{comment.postId.title}"
                          </span>
                          
                          {comment.likes > 0 && (
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {comment.likes}
                            </span>
                          )}
                          
                          {comment.reports > 0 && (
                            <span className="flex items-center gap-1 text-red-600">
                              <Flag className="h-3 w-3" />
                              {comment.reports} reports
                            </span>
                          )}
                        </div>
                        
                        {comment.moderatedBy && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <p>
                              Moderated by {comment.moderatedBy.name} on {formatDate(comment.moderatedAt!)}
                              {comment.moderationReason && (
                                <span className="block mt-1 text-muted-foreground">
                                  Reason: {comment.moderationReason}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingComment(comment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {comment.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModerateComment(comment._id, 'approved')}
                          disabled={moderating}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModerateComment(comment._id, 'rejected')}
                          disabled={moderating}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModerateComment(comment._id, 'spam')}
                          disabled={moderating}
                          className="text-orange-600"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={deleting === comment._id}
                      className="text-red-600"
                    >
                      {deleting === comment._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {comments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No comments found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filters." 
                  : "No comments to moderate at this time."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comment Details Dialog */}
      {viewingComment && (
        <Dialog open={!!viewingComment} onOpenChange={() => setViewingComment(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comment Details</DialogTitle>
              <DialogDescription>
                Full comment information and moderation history
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Author</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Avatar>
                      <AvatarImage src={viewingComment.author.avatar} />
                      <AvatarFallback>
                        {viewingComment.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{viewingComment.author.name}</p>
                      <p className="text-sm text-muted-foreground">{viewingComment.author.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Blog Post</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium">{viewingComment.postId.title}</p>
                    <Badge variant="outline">{viewingComment.postId.category}</Badge>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Comment Content</Label>
                  <div className="mt-1 p-3 border rounded-md bg-muted/50">
                    <p className="text-sm whitespace-pre-wrap">{viewingComment.content}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(viewingComment.status)}>
                        {viewingComment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Created</Label>
                    <p className="text-sm mt-1">{formatDate(viewingComment.createdAt)}</p>
                  </div>
                </div>
                
                {viewingComment.moderatedBy && (
                  <div>
                    <Label>Moderation</Label>
                    <div className="mt-1 p-3 border rounded-md">
                      <p className="text-sm">
                        Moderated by <strong>{viewingComment.moderatedBy.name}</strong> on{' '}
                        {formatDate(viewingComment.moderatedAt!)}
                      </p>
                      {viewingComment.moderationReason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Reason: {viewingComment.moderationReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingComment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}