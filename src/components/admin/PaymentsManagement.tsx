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
import { CreditCard, DollarSign, RefreshCw, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

export function PaymentsManagement() {
  const [activeTab, setActiveTab] = useState("transactions");

  // Mock data for payments
  const transactions = [
    {
      id: "TXN-2024-001",
      orderId: "ORD-2024-001",
      customer: "Rahul Singh",
      amount: 2500,
      method: "Credit Card",
      status: "completed",
      date: "2024-01-15 14:30",
      gateway: "Razorpay"
    },
    {
      id: "TXN-2024-002",
      orderId: "ORD-2024-002",
      customer: "Priya Sharma",
      amount: 1800,
      method: "UPI",
      status: "pending",
      date: "2024-01-14 16:45",
      gateway: "Razorpay"
    },
    {
      id: "TXN-2024-003",
      orderId: "ORD-2024-003",
      customer: "Amit Patel",
      amount: 3200,
      method: "Net Banking",
      status: "failed",
      date: "2024-01-13 11:20",
      gateway: "Razorpay"
    }
  ];

  const refunds = [
    {
      id: "REF-2024-001",
      originalTxn: "TXN-2024-001",
      customer: "Rahul Singh",
      amount: 500,
      reason: "Product damaged",
      status: "processed",
      requestedDate: "2024-01-16",
      processedDate: "2024-01-17"
    }
  ];

  const paymentStats = {
    totalProcessed: 1250000,
    pendingPayments: 45000,
    failedPayments: 12000,
    refundsProcessed: 25000
  };

  const handleProcessRefund = (transactionId, amount, reason) => {
    // API call to process refund
    console.log(`Processing refund for ${transactionId}, amount: ${amount}, reason: ${reason}`);
  };

  const handleRetryPayment = (transactionId) => {
    // API call to retry payment
    console.log(`Retrying payment for ${transactionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Payments Management</h2>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Processed</p>
                <p className="text-2xl font-bold">₹{paymentStats.totalProcessed.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">₹{paymentStats.pendingPayments.toLocaleString()}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Payments</p>
                <p className="text-2xl font-bold">₹{paymentStats.failedPayments.toLocaleString()}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refunds Processed</p>
                <p className="text-2xl font-bold">₹{paymentStats.refundsProcessed.toLocaleString()}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refunds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Transactions
              </CardTitle>
              <CardDescription>
                Monitor and manage all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.orderId}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>Transaction #{transaction.id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Transaction ID</Label>
                                    <p className="text-sm">{transaction.id}</p>
                                  </div>
                                  <div>
                                    <Label>Order ID</Label>
                                    <p className="text-sm">{transaction.orderId}</p>
                                  </div>
                                  <div>
                                    <Label>Customer</Label>
                                    <p className="text-sm">{transaction.customer}</p>
                                  </div>
                                  <div>
                                    <Label>Amount</Label>
                                    <p className="text-sm">₹{transaction.amount}</p>
                                  </div>
                                  <div>
                                    <Label>Payment Method</Label>
                                    <p className="text-sm">{transaction.method}</p>
                                  </div>
                                  <div>
                                    <Label>Gateway</Label>
                                    <p className="text-sm">{transaction.gateway}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <Badge variant={
                                      transaction.status === 'completed' ? 'default' :
                                      transaction.status === 'pending' ? 'secondary' : 'destructive'
                                    }>
                                      {transaction.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Date</Label>
                                    <p className="text-sm">{transaction.date}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {transaction.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetryPayment(transaction.id)}
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Retry
                            </Button>
                          )}

                          {transaction.status === 'completed' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Refund
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Refund</DialogTitle>
                                  <DialogDescription>Process refund for transaction #{transaction.id}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="refund-amount">Refund Amount</Label>
                                    <Input
                                      id="refund-amount"
                                      type="number"
                                      placeholder="Enter refund amount"
                                      defaultValue={transaction.amount}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="refund-reason">Reason</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="customer-request">Customer Request</SelectItem>
                                        <SelectItem value="product-damaged">Product Damaged</SelectItem>
                                        <SelectItem value="wrong-item">Wrong Item</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button onClick={() => handleProcessRefund(transaction.id, transaction.amount, 'customer-request')}>
                                    Process Refund
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Refund Management
              </CardTitle>
              <CardDescription>
                Track and manage refund requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Original Transaction</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Processed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>{refund.originalTxn}</TableCell>
                      <TableCell>{refund.customer}</TableCell>
                      <TableCell>₹{refund.amount}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {refund.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{refund.requestedDate}</TableCell>
                      <TableCell>{refund.processedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}