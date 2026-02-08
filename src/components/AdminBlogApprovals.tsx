import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, CheckCircle, XCircle, AlertCircle, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  category?: string;
  status: 'draft' | 'published';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  artisanId?: {
    name: string;
    businessInfo?: {
      businessName: string;
    };
  };
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function AdminBlogApprovals() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchBlogs = async (status: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `/admin-approvals/pending-blogs?status=${status}&page=${page}&limit=${pagination.limit}`,
        {
          method: 'GET',
        }
      ) as { success: boolean; blogs: any[]; page: number; total: number; pages: number };

      if (response?.success) {
        setBlogs(response.blogs || []);
        setPagination({
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          pages: response.pages,
        });
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch blogs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(activeTab, pagination.page);
  }, [activeTab]);

  const handleApprove = async () => {
    if (!selectedBlog) return;

    setIsProcessing(true);
    try {
      const response = await apiRequest(
        `/admin-approvals/approve-blog/${selectedBlog._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            approvalNotes: actionReason,
          }),
        }
      ) as { success: boolean; message: string };

      if (response?.success) {
        toast({
          title: 'Success',
          description: `"${selectedBlog.title}" has been approved and published`,
        });
        setShowActionDialog(false);
        setActionReason('');
        fetchBlogs(activeTab, pagination.page);
      }
    } catch (error) {
      console.error('Error approving blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve blog',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBlog || !actionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiRequest(
        `/admin-approvals/reject-blog/${selectedBlog._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            rejectionReason: actionReason,
          }),
        }
      ) as { success: boolean; message: string };

      if (response?.success) {
        toast({
          title: 'Success',
          description: `"${selectedBlog.title}" has been rejected`,
        });
        setShowActionDialog(false);
        setActionReason('');
        fetchBlogs(activeTab, pagination.page);
      }
    } catch (error) {
      console.error('Error rejecting blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject blog',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Blog Approvals</h2>
        <p className="text-muted-foreground mt-2">Review and manage blog post submissions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending
            {pagination.total > 0 && activeTab === 'pending' && (
              <Badge variant="secondary" className="ml-2">
                {pagination.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Published</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Blog Posts</CardTitle>
              <CardDescription>
                {pagination.total} blog posts awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending blog posts</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog._id}>
                          <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                          <TableCell>{blog.artisanId?.name || 'Unknown'}</TableCell>
                          <TableCell>{blog.category || 'N/A'}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBlog(blog);
                                    setShowDetailDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBlog(blog);
                                    setActionType('approve');
                                    setActionReason('');
                                    setShowActionDialog(true);
                                  }}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve & Publish
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBlog(blog);
                                    setActionType('reject');
                                    setActionReason('');
                                    setShowActionDialog(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Blog Posts</CardTitle>
              <CardDescription>Successfully published blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No published blog posts</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Published Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog._id}>
                          <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                          <TableCell>{blog.artisanId?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-sm">
                            {blog.approvedAt
                              ? new Date(blog.approvedAt).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBlog(blog);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Blog Posts</CardTitle>
              <CardDescription>Blog posts that were rejected</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No rejected blog posts</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Rejection Reason</TableHead>
                        <TableHead>Rejected Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog._id}>
                          <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                          <TableCell>{blog.artisanId?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {blog.rejectionReason || 'No reason provided'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {blog.approvedAt
                              ? new Date(blog.approvedAt).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBlog(blog);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBlog?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(selectedBlog?.approvalStatus || '')}>
                  {selectedBlog?.approvalStatus?.toUpperCase()}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedBlog && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Blog Post Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">{selectedBlog.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Slug</p>
                      <p className="font-medium text-sm">{selectedBlog.slug}</p>
                    </div>
                    {selectedBlog.category && (
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedBlog.category}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline">{selectedBlog.status}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Artisan Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Artisan</p>
                      <p className="font-medium">{selectedBlog.artisanId?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business</p>
                      <p className="font-medium">
                        {selectedBlog.artisanId?.businessInfo?.businessName || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedBlog.content && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Content Preview</h3>
                      <div className="text-sm max-h-48 overflow-y-auto bg-muted p-3 rounded">
                        {selectedBlog.content.substring(0, 500)}
                        {selectedBlog.content.length > 500 && '...'}
                      </div>
                    </div>
                  </>
                )}

                {selectedBlog.approvalNotes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 text-green-600">Approval Notes</h3>
                      <p className="text-sm">{selectedBlog.approvalNotes}</p>
                    </div>
                  </>
                )}

                {selectedBlog.rejectionReason && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 text-red-600">Rejection Reason</h3>
                      <p className="text-sm">{selectedBlog.rejectionReason}</p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Blog Post' : 'Reject Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve and publish "${selectedBlog?.title}"?`
                : `Are you sure you want to reject "${selectedBlog?.title}"?`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">
                {actionType === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
              </Label>
              <Textarea
                id="reason"
                placeholder={
                  actionType === 'approve'
                    ? 'Add any approval notes...'
                    : 'Please provide a reason for rejection...'
                }
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={actionType === 'approve' ? handleApprove : handleReject}
              disabled={isProcessing || (actionType === 'reject' && !actionReason.trim())}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : actionType === 'approve' ? (
                'Approve & Publish'
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
