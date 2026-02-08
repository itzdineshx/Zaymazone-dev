import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, Users, Key, Lock, Unlock, UserCheck, AlertTriangle } from "lucide-react";

export function AuthManagement() {
  const [activeTab, setActiveTab] = useState("users");

  // Mock data for users and roles
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@zaymazone.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 10:30",
      permissions: ["read", "write", "delete", "manage_users"]
    },
    {
      id: 2,
      name: "Moderator",
      email: "moderator@zaymazone.com",
      role: "moderator",
      status: "active",
      lastLogin: "2024-01-14 15:45",
      permissions: ["read", "write", "moderate"]
    },
    {
      id: 3,
      name: "Support Agent",
      email: "support@zaymazone.com",
      role: "support",
      status: "inactive",
      lastLogin: "2024-01-10 09:15",
      permissions: ["read", "support"]
    }
  ];

  const roles = [
    {
      id: 1,
      name: "Admin",
      description: "Full system access",
      permissions: ["read", "write", "delete", "manage_users", "system_config"],
      userCount: 2
    },
    {
      id: 2,
      name: "Moderator",
      description: "Content moderation access",
      permissions: ["read", "write", "moderate"],
      userCount: 5
    },
    {
      id: 3,
      name: "Support",
      description: "Customer support access",
      permissions: ["read", "support"],
      userCount: 8
    }
  ];

  const permissions = [
    { id: "read", name: "Read Access", description: "View data and content" },
    { id: "write", name: "Write Access", description: "Create and edit content" },
    { id: "delete", name: "Delete Access", description: "Delete content and data" },
    { id: "manage_users", name: "User Management", description: "Manage user accounts and roles" },
    { id: "moderate", name: "Content Moderation", description: "Moderate user content" },
    { id: "support", name: "Customer Support", description: "Access support tools" },
    { id: "system_config", name: "System Configuration", description: "Configure system settings" }
  ];

  const handleUpdateUserRole = (userId, newRole) => {
    // API call to update user role
    console.log(`Updating user ${userId} role to ${newRole}`);
  };

  const handleToggleUserStatus = (userId, currentStatus) => {
    // API call to toggle user status
    console.log(`Toggling user ${userId} status from ${currentStatus}`);
  };

  const handleCreateRole = (roleData) => {
    // API call to create new role
    console.log("Creating new role:", roleData);
  };

  const handleUpdatePermissions = (roleId, permissions) => {
    // API call to update role permissions
    console.log(`Updating permissions for role ${roleId}:`, permissions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Authentication Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Edit Role
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update User Role</DialogTitle>
                                <DialogDescription>Change role for {user.name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Current Role</Label>
                                  <p className="text-sm text-muted-foreground">{user.role}</p>
                                </div>
                                <div>
                                  <Label htmlFor="new-role">New Role</Label>
                                  <Select onValueChange={(value) => handleUpdateUserRole(user.id, value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select new role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="moderator">Moderator</SelectItem>
                                      <SelectItem value="support">Support</SelectItem>
                                      <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>Update Role</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                          >
                            {user.status === 'active' ? (
                              <>
                                <Lock className="w-4 h-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Role Management</h3>
              <p className="text-sm text-muted-foreground">Define roles and their permissions</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Key className="w-4 h-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define a new role with specific permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>
                  <div>
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Enter role description" />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="space-y-2 mt-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Switch id={`perm-${permission.id}`} />
                          <Label htmlFor={`perm-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => handleCreateRole({ name: "New Role", permissions: [] })}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {role.name}
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Permissions:</Label>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          Edit Permissions
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Role Permissions</DialogTitle>
                          <DialogDescription>Modify permissions for {role.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Permissions</Label>
                            <div className="space-y-2 mt-2">
                              {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Switch
                                    id={`edit-perm-${permission.id}`}
                                    defaultChecked={role.permissions.includes(permission.id)}
                                  />
                                  <Label htmlFor={`edit-perm-${permission.id}`} className="text-sm">
                                    {permission.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={() => handleUpdatePermissions(role.id, role.permissions)}>
                            Update Permissions
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Permission Management
              </CardTitle>
              <CardDescription>
                View and manage system permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{permission.name}</h4>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                    <Badge variant="outline">{permission.id}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}