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

interface Product {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
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
  categoryId?: {
    name: string;
  };
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function AdminProductApprovals() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  const fetchProducts = async (status: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `/admin-approvals/pending-products?status=${status}&page=${page}&limit=${pagination.limit}`,
        {
          method: 'GET',
        }
      ) as { success: boolean; products: any[]; page: number; total: number; pages: number };

      if (response?.success) {
        setProducts(response.products || []);
        setPagination({
          page: response.page,
          limit: pagination.limit,
          total: response.total,
          pages: response.pages,
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeTab, pagination.page);
  }, [activeTab]);

  const handleApprove = async () => {
    if (!selectedProduct) return;

    setIsProcessing(true);
    try {
      const response = await apiRequest(
        `/admin-approvals/approve-product/${selectedProduct._id}`,
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
          description: `${selectedProduct.name} has been approved`,
        });
        setShowActionDialog(false);
        setActionReason('');
        fetchProducts(activeTab, pagination.page);
      }
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve product',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProduct || !actionReason.trim()) {
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
        `/admin-approvals/reject-product/${selectedProduct._id}`,
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
          description: `${selectedProduct.name} has been rejected`,
        });
        setShowActionDialog(false);
        setActionReason('');
        fetchProducts(activeTab, pagination.page);
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject product',
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
        <h2 className="text-3xl font-bold tracking-tight">Product Approvals</h2>
        <p className="text-muted-foreground mt-2">Review and manage product submissions</p>
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
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Products</CardTitle>
              <CardDescription>
                {pagination.total} products awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending products</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.artisanId?.name || 'Unknown'}</TableCell>
                          <TableCell>₹{product.price || 'N/A'}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(product.createdAt).toLocaleDateString()}
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
                                    setSelectedProduct(product);
                                    setShowDetailDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setActionType('approve');
                                    setActionReason('');
                                    setShowActionDialog(true);
                                  }}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProduct(product);
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
              <CardTitle>Approved Products</CardTitle>
              <CardDescription>Successfully approved products</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No approved products</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Approved Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.artisanId?.name || 'Unknown'}</TableCell>
                          <TableCell>₹{product.price || 'N/A'}</TableCell>
                          <TableCell className="text-sm">
                            {product.approvedAt
                              ? new Date(product.approvedAt).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
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
              <CardTitle>Rejected Products</CardTitle>
              <CardDescription>Products that were rejected</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No rejected products</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Rejection Reason</TableHead>
                        <TableHead>Rejected Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.artisanId?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {product.rejectionReason || 'No reason provided'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {product.approvedAt
                              ? new Date(product.approvedAt).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
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
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(selectedProduct?.approvalStatus || '')}>
                  {selectedProduct?.approvalStatus?.toUpperCase()}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Product Name</p>
                      <p className="font-medium">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">₹{selectedProduct.price || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Artisan Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Artisan</p>
                      <p className="font-medium">{selectedProduct.artisanId?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business</p>
                      <p className="font-medium">
                        {selectedProduct.artisanId?.businessInfo?.businessName || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedProduct.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Description</h3>
                      <p className="text-sm">{selectedProduct.description}</p>
                    </div>
                  </>
                )}

                {selectedProduct.approvalNotes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 text-green-600">Approval Notes</h3>
                      <p className="text-sm">{selectedProduct.approvalNotes}</p>
                    </div>
                  </>
                )}

                {selectedProduct.rejectionReason && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 text-red-600">Rejection Reason</h3>
                      <p className="text-sm">{selectedProduct.rejectionReason}</p>
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
              {actionType === 'approve' ? 'Approve Product' : 'Reject Product'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve "${selectedProduct?.name}"?`
                : `Are you sure you want to reject "${selectedProduct?.name}"?`}
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
                'Approve'
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
