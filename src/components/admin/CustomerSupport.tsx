import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeadphonesIcon, MessageSquare, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

export function CustomerSupport() {
  const [activeTab, setActiveTab] = useState("tickets");

  // Mock data for support tickets
  const tickets = [
    {
      id: "TICK-2024-001",
      customer: "Rahul Singh",
      email: "rahul.singh@email.com",
      subject: "Order not delivered",
      category: "Delivery",
      priority: "high",
      status: "open",
      createdAt: "2024-01-15 10:30",
      lastUpdated: "2024-01-15 14:20",
      assignedTo: "Support Agent 1"
    },
    {
      id: "TICK-2024-002",
      customer: "Priya Sharma",
      email: "priya.sharma@email.com",
      subject: "Product quality issue",
      category: "Product",
      priority: "medium",
      status: "in_progress",
      createdAt: "2024-01-14 16:45",
      lastUpdated: "2024-01-15 09:15",
      assignedTo: "Support Agent 2"
    },
    {
      id: "TICK-2024-003",
      customer: "Amit Patel",
      email: "amit.patel@email.com",
      subject: "Refund request",
      category: "Payment",
      priority: "low",
      status: "resolved",
      createdAt: "2024-01-13 11:20",
      lastUpdated: "2024-01-14 16:30",
      assignedTo: "Support Agent 1"
    }
  ];

  const supportStats = {
    totalTickets: 145,
    openTickets: 23,
    inProgressTickets: 12,
    resolvedToday: 8,
    averageResponseTime: "2.5 hours"
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    // API call to update ticket status
    console.log(`Updating ticket ${ticketId} status to ${newStatus}`);
  };

  const handleAssignTicket = (ticketId, agentId) => {
    // API call to assign ticket
    console.log(`Assigning ticket ${ticketId} to agent ${agentId}`);
  };

  const handleSendResponse = (ticketId, response) => {
    // API call to send response
    console.log(`Sending response to ticket ${ticketId}: ${response}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HeadphonesIcon className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Customer Support</h2>
      </div>

      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{supportStats.totalTickets}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold">{supportStats.openTickets}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{supportStats.inProgressTickets}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold">{supportStats.resolvedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{supportStats.averageResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Support Tickets
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Support Agents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Support Tickets
              </CardTitle>
              <CardDescription>
                Manage customer support tickets and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.customer}</p>
                          <p className="text-sm text-muted-foreground">{ticket.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.priority === 'high' ? 'destructive' :
                          ticket.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.status === 'open' ? 'destructive' :
                          ticket.status === 'in_progress' ? 'default' : 'secondary'
                        }>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Ticket #{ticket.id}</DialogTitle>
                                <DialogDescription>{ticket.subject}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Customer</Label>
                                    <p>{ticket.customer}</p>
                                    <p className="text-sm text-muted-foreground">{ticket.email}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <Select
                                      defaultValue={ticket.status}
                                      onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Priority</Label>
                                    <Badge variant={
                                      ticket.priority === 'high' ? 'destructive' :
                                      ticket.priority === 'medium' ? 'default' : 'secondary'
                                    }>
                                      {ticket.priority}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Assigned To</Label>
                                    <Select
                                      defaultValue={ticket.assignedTo}
                                      onValueChange={(value) => handleAssignTicket(ticket.id, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Support Agent 1">Support Agent 1</SelectItem>
                                        <SelectItem value="Support Agent 2">Support Agent 2</SelectItem>
                                        <SelectItem value="Support Agent 3">Support Agent 3</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label>Send Response</Label>
                                  <Textarea placeholder="Type your response here..." />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Close</Button>
                                <Button onClick={() => handleSendResponse(ticket.id, "Response text")}>
                                  Send Response
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Support Agents
              </CardTitle>
              <CardDescription>
                Manage support team members and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Support Agent 1", tickets: 45, resolved: 42, rating: 4.8 },
                  { name: "Support Agent 2", tickets: 38, resolved: 35, rating: 4.6 },
                  { name: "Support Agent 3", tickets: 28, resolved: 26, rating: 4.9 }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {agent.resolved}/{agent.tickets} tickets resolved
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{agent.rating} ★ rating</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((agent.resolved/agent.tickets)*100)}% resolution rate
                      </p>
                    </div>
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