import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useSellerProducts } from '@/hooks/useSeller';
import { sellerService } from '@/services/sellerService';
import { Plus, Edit, Trash2, Loader2, AlertCircle, Search, RefreshCw } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  category: string;
  images: string[];
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export function SellerProductManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stockCount: '',
    category: '',
    images: []
  });
  const { toast } = useToast();
  const { products, pagination, loading, error } = useSellerProducts(page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stockCount) {
      toast({ title: 'Validation Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    try {
      const productData = { name: formData.name, description: formData.description, price: parseFloat(formData.price), originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined, stockCount: parseInt(formData.stockCount), category: formData.category, images: formData.images };
      if (editingId) {
        await sellerService.updateProduct(editingId, productData);
        toast({ title: 'Success', description: 'Product updated' });
      } else {
        await sellerService.createProduct(productData);
        toast({ title: 'Success', description: 'Product created' });
      }
      setIsModalOpen(false);
      resetForm();
      setPage(1);
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error', description: 'Failed to save product', variant: 'destructive' });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({ name: product.name, description: product.description, price: product.price.toString(), originalPrice: product.originalPrice?.toString() || '', stockCount: product.stockCount.toString(), category: product.category, images: product.images });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product?')) return;
    try {
      await sellerService.deleteProduct(productId);
      toast({ title: 'Success', description: 'Product deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', originalPrice: '', stockCount: '', category: '', images: [] });
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Product Management</h2>
        <p className="text-muted-foreground">Manage your products</p>
      </div>
      
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2 border rounded px-3">
              <Search className="w-4 h-4" />
              <Input 
                placeholder="Search..." 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                className="border-0" 
              />
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit' : 'Add'} Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <Input 
                        placeholder="Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Handicrafts">Handicrafts</SelectItem>
                          <SelectItem value="Textiles">Textiles</SelectItem>
                          <SelectItem value="Jewelry">Jewelry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="Description" 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      rows={3} 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Price *</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Original</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        value={formData.originalPrice} 
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stock *</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={formData.stockCount} 
                        onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <ImageUpload
                      images={formData.images}
                      onImagesChange={(images) => setFormData({ ...formData, images })}
                      maxImages={5}
                      category="products"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Products ({pagination?.total || 0})</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : products.length === 0 ? (
            <p>No products</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{formatPrice(p.price)}</TableCell>
                    <TableCell>
                      <Badge>{p.stockCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isActive ? 'default' : 'secondary'}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(p)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive" 
                          onClick={() => handleDelete(p._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
