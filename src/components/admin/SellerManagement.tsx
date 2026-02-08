import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Plus,
  Search, 
  Filter,
  RefreshCw,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Package,
  Loader2
} from 'lucide-react';

interface Seller {
  _id: string;
  name: string;
  businessInfo: {
    businessName: string;
    sellerType: string;
    contact: {
      email: string;
      phone: string;
    };
  };
  location: {
    city: string;
    state: string;
  };
  specialties: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  userId: {
    name: string;
    email: string;
  };
  rating?: number;
  totalProducts?: number;
  totalSales?: number;
}

export function SellerManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editFormData, setEditFormData] = useState<Partial<Seller>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    setLoading(true);
    try {
      // Load both approved and pending sellers
      const [approvedResponse, pendingResponse] = await Promise.all([
        adminService.getArtisans({ status: 'active' }),
        adminService.getPendingArtisans()
      ]);

      setSellers(approvedResponse.artisans || []);
      setPendingSellers(pendingResponse.artisans || []);
    } catch (error) {
      console.error('Failed to load sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sellers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      await adminService.approveArtisan(sellerId);
      toast({
        title: 'Success',
        description: 'Seller approved successfully'
      });
      loadSellers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve seller',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (sellerId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive'
      });
      return;
    }

    try {
      await adminService.rejectArtisan(sellerId, reason);
      toast({
        title: 'Success',
        description: 'Seller rejected successfully'
      });
      setRejectionReason('');
      loadSellers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject seller',
        variant: 'destructive'
      });
    }
  };

  const handleDeactivate = async (sellerId: string) => {
    try {
      await adminService.updateArtisan(sellerId, { isActive: false });
      toast({
        title: 'Success',
        description: 'Seller deactivated successfully'
      });
      loadSellers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to deactivate seller',
        variant: 'destructive'
      });
    }
  };

  const handleActivate = async (sellerId: string) => {
    try {
      await adminService.updateArtisan(sellerId, { isActive: true });
      toast({
        title: 'Success',
        description: 'Seller activated successfully'
      });
      loadSellers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate seller',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedSeller || !editFormData) return;

    try {
      await adminService.updateArtisan(selectedSeller._id, editFormData);
      toast({
        title: 'Success',
        description: 'Seller updated successfully'
      });
      setIsEditModalOpen(false);
      loadSellers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update seller',
        variant: 'destructive'
      });
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = 
      seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.businessInfo?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.businessInfo?.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && seller.isActive) ||
      (statusFilter === 'inactive' && !seller.isActive);

    return matchesSearch && matchesStatus;
  });

  const filteredPendingSellers = pendingSellers.filter(seller =>
    seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.businessInfo?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (seller: Seller) => {
    if (seller.approvalStatus === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    } else if (seller.approvalStatus === 'approved' && seller.isActive) {
      return <Badge variant="default">Active</Badge>;
    } else if (seller.approvalStatus === 'approved' && !seller.isActive) {
      return <Badge variant="outline">Inactive</Badge>;
    } else if (seller.approvalStatus === 'rejected') {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading sellers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">Seller Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage artisan applications and seller accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadSellers()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Seller
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sellers</p>
                <p className="text-2xl font-bold">{sellers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sellers</p>
                <p className="text-2xl font-bold">{sellers.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{pendingSellers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Sellers</p>
                <p className="text-2xl font-bold">{sellers.filter(s => !s.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sellers</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="approved" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="approved">Approved Sellers ({sellers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval ({pendingSellers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Sellers</CardTitle>
              <CardDescription>Manage existing seller accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{seller.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {seller.specialties?.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{seller.businessInfo?.businessName}</p>
                          <p className="text-sm text-muted-foreground">{seller.businessInfo?.sellerType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {seller.businessInfo?.contact?.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {seller.businessInfo?.contact?.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="text-sm">{seller.location?.city}, {seller.location?.state}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(seller)}</TableCell>
                      <TableCell className="text-sm">{formatDate(seller.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSeller(seller);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSeller(seller);
                              setEditFormData(seller);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {seller.isActive ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => handleDeactivate(seller._id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => handleActivate(seller._id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSellers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No sellers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Seller Applications</CardTitle>
              <CardDescription>Review and approve new seller applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingSellers.map((seller) => (
                    <TableRow key={seller._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <p className="text-sm text-muted-foreground">{seller.userId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{seller.businessInfo?.businessName}</p>
                          <p className="text-sm text-muted-foreground">{seller.businessInfo?.sellerType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {seller.specialties?.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(seller.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSeller(seller);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(seller._id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Application</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this seller application.
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setRejectionReason('')}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReject(seller._id, rejectionReason)}
                                >
                                  Reject Application
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPendingSellers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending applications
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Seller Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seller Details</DialogTitle>
            <DialogDescription>
              Detailed information about the seller
            </DialogDescription>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Personal Information</h4>
                  <div className="space-y-2 mt-2">
                    <p><strong>Name:</strong> {selectedSeller.name}</p>
                    <p><strong>Email:</strong> {selectedSeller.userId?.email}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedSeller)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Business Information</h4>
                  <div className="space-y-2 mt-2">
                    <p><strong>Business Name:</strong> {selectedSeller.businessInfo?.businessName}</p>
                    <p><strong>Type:</strong> {selectedSeller.businessInfo?.sellerType}</p>
                    <p><strong>Phone:</strong> {selectedSeller.businessInfo?.contact?.phone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Location</h4>
                <p className="mt-2">{selectedSeller.location?.city}, {selectedSeller.location?.state}</p>
              </div>

              <div>
                <h4 className="font-medium">Specialties</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSeller.specialties?.map((specialty, index) => (
                    <Badge key={index} variant="outline">{specialty}</Badge>
                  ))}
                </div>
              </div>

              {selectedSeller.rejectionReason && (
                <div>
                  <h4 className="font-medium text-red-600">Rejection Reason</h4>
                  <p className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    {selectedSeller.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Seller Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Seller</DialogTitle>
            <DialogDescription>
              Update seller information
            </DialogDescription>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <Input
                    value={editFormData.businessInfo?.businessName || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      businessInfo: {
                        ...editFormData.businessInfo,
                        businessName: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEdit}>
                  Update Seller
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}