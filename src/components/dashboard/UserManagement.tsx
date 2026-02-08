import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from '@/components/ImageUpload';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  authProvider?: string;
  firebaseUid?: string;
  lastLogin?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    avatar: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    preferences: {
      newsletter: true,
      notifications: true,
      language: "en"
    },
    isEmailVerified: false,
    isActive: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined
      });
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadUsers();
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    loadUsers();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
      avatar: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      preferences: {
        newsletter: true,
        notifications: true,
        language: "en"
      },
      isEmailVerified: false,
      isActive: true
    });
  };

  const handleCreateUser = async () => {
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        avatar: formData.avatar || undefined,
        address: formData.street ? {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        } : undefined,
        preferences: formData.preferences
      };

      await adminService.createUser(userData);
      toast({
        title: "Success",
        description: "User created successfully"
      });
      setIsCreateDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || undefined,
        avatar: formData.avatar || undefined,
        address: formData.street ? {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        } : undefined,
        preferences: formData.preferences,
        isEmailVerified: formData.isEmailVerified,
        isActive: formData.isActive
      };

      await adminService.updateUser(editingUser._id, userData);

      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminService.deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't show password
      role: user.role,
      phone: user.phone || "",
      avatar: user.avatar || "",
      street: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zipCode: user.address?.zipCode || "",
      country: user.address?.country || "India",
      preferences: user.preferences || {
        newsletter: true,
        notifications: true,
        language: "en"
      },
      isEmailVerified: user.isEmailVerified || false,
      isActive: user.isActive !== false // Default to true if not set
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user account to the system with complete profile information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="artisan">Artisan</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Profile Image</h3>
                <ImageUpload
                  images={formData.avatar ? [formData.avatar] : []}
                  onImagesChange={(images) => setFormData({ ...formData, avatar: images[0] || '' })}
                  maxImages={1}
                  category="avatars"
                  singleMode={true}
                />
              </div>

              {/* User Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">User Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={formData.preferences.language} 
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        preferences: { 
                          ...formData.preferences, 
                          language: value 
                        } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={formData.preferences.newsletter}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        preferences: { 
                          ...formData.preferences, 
                          newsletter: e.target.checked 
                        } 
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={formData.preferences.notifications}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        preferences: { 
                          ...formData.preferences, 
                          notifications: e.target.checked 
                        } 
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="artisan">Artisan</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all user accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Auth Provider</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.phone && (
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? "destructive" : user.role === 'artisan' ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.authProvider || 'firebase'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {user.isEmailVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {user.role !== 'admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingUser(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="artisan">Artisan</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
              <div>
                <Label htmlFor="edit-street">Street Address</Label>
                <Input
                  id="edit-street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-zipCode">ZIP Code</Label>
                  <Input
                    id="edit-zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Profile Image</h3>
              <ImageUpload
                images={formData.avatar ? [formData.avatar] : []}
                onImagesChange={(images) => setFormData({ ...formData, avatar: images[0] || '' })}
                maxImages={1}
                category="avatars"
                singleMode={true}
              />
            </div>

            {/* User Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">User Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-language">Language</Label>
                  <Select 
                    value={formData.preferences.language} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      preferences: { 
                        ...formData.preferences, 
                        language: value 
                      } 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { 
                        ...formData.preferences, 
                        newsletter: e.target.checked 
                      } 
                    })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-newsletter">Subscribe to newsletter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-notifications"
                    checked={formData.preferences.notifications}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { 
                        ...formData.preferences, 
                        notifications: e.target.checked 
                      } 
                    })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-notifications">Enable notifications</Label>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Account Settings</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-email-verified"
                    checked={formData.isEmailVerified}
                    onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-email-verified">Email Verified</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-active"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-active">Account Active</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}