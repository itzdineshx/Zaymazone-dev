import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentData {
  orderId?: string;
  txnId?: string;
  bankTxnId?: string;
  amount?: number;
  paymentMode?: string;
  bankName?: string;
  status?: string;
  error?: string;
  errorCode?: string;
}

/**
 * Mock Paytm Payment Page
 * Simulates the Paytm payment flow for testing without actual API keys
 */
export default function MockPaytmPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const orderId = searchParams.get('orderId');
  const mockOrderId = searchParams.get('mockOrderId');
  const amount = searchParams.get('amount');
  const txnToken = searchParams.get('txnToken');

  useEffect(() => {
    const processMockPayment = async () => {
      try {
        // Simulate payment processing delay (2-3 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

        // Simulate 90% success rate for testing
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          setPaymentStatus('success');
          
          const mockTxnId = `PAYTM_TXN_${Date.now()}`;
          const mockBankTxnId = `BANK_${Date.now()}`;
          
          setPaymentData({
            orderId: mockOrderId || undefined,
            txnId: mockTxnId,
            bankTxnId: mockBankTxnId,
            amount: parseFloat(amount || '0'),
            paymentMode: 'UPI',
            bankName: 'Paytm Payments Bank',
            status: 'TXN_SUCCESS'
          });

          // Simulate callback to backend
          console.log('🎭 Mock Paytm payment successful:', {
            orderId: mockOrderId,
            txnId: mockTxnId,
            amount
          });

          // Redirect to success page after 2 seconds
          setTimeout(() => {
            navigate(`/payment-success?payment_id=${mockTxnId}&order_id=${mockOrderId}&status=success&gateway=paytm`);
          }, 2000);
        } else {
          setPaymentStatus('failed');
          setPaymentData({
            orderId: mockOrderId || undefined,
            error: 'Transaction failed - simulated failure for testing',
            errorCode: 'MOCK_FAILURE'
          });
          
          // Redirect to failure page after 2 seconds
          setTimeout(() => {
            navigate(`/payment-failed?order_id=${mockOrderId}&status=failed&gateway=paytm`);
          }, 2000);
        }
      } catch (error) {
        setPaymentStatus('failed');
        setPaymentData({
          error: 'Payment processing error'
        });
      }
    };

    if (orderId && mockOrderId && amount && txnToken) {
      processMockPayment();
    } else {
      setPaymentStatus('failed');
      setPaymentData({
        error: 'Invalid payment parameters'
      });
    }
  }, [orderId, mockOrderId, amount, txnToken, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {paymentStatus === 'processing' && (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    Processing Paytm Payment
                  </>
                )}
                {paymentStatus === 'success' && (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Payment Successful
                  </>
                )}
                {paymentStatus === 'failed' && (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    Payment Failed
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {paymentStatus === 'processing' && 'Please wait while we process your Paytm payment...'}
                {paymentStatus === 'success' && 'Your payment has been processed successfully via Paytm!'}
                {paymentStatus === 'failed' && 'There was an issue processing your Paytm payment.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Mock Mode Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Mock Payment Mode</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This is a simulated Paytm payment for testing. No actual transaction is being processed.
                    </p>
                  </div>
                </div>
              </div>

              {paymentData && (
                <div className="space-y-3 text-sm">
                  {paymentData.orderId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {paymentData.orderId}
                      </span>
                    </div>
                  )}
                  
                  {paymentData.amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold text-lg">₹{paymentData.amount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {paymentData.txnId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {paymentData.txnId}
                      </span>
                    </div>
                  )}
                  
                  {paymentData.bankTxnId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bank Txn ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {paymentData.bankTxnId}
                      </span>
                    </div>
                  )}
                  
                  {paymentData.paymentMode && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Payment Mode:</span>
                      <Badge variant="outline">{paymentData.paymentMode}</Badge>
                    </div>
                  )}
                  
                  {paymentData.bankName && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="text-sm">{paymentData.bankName}</span>
                    </div>
                  )}
                  
                  {paymentData.status && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={paymentData.status === 'TXN_SUCCESS' ? 'default' : 'destructive'}>
                        {paymentData.status}
                      </Badge>
                    </div>
                  )}
                  
                  {paymentData.error && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Error:</span>
                      <span className="text-sm text-destructive">{paymentData.error}</span>
                    </div>
                  )}
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                </div>
              )}

              {paymentStatus === 'success' && (
                <Separator className="my-4" />
              )}

              {/* Info Message */}
              <div className="text-xs text-center text-muted-foreground pt-4 border-t">
                {paymentStatus === 'processing' && 'Redirecting to confirmation page...'}
                {paymentStatus === 'success' && 'Redirecting to order confirmation...'}
                {paymentStatus === 'failed' && (
                  <div className="space-y-2">
                    <p>Please try again or contact support if the issue persists.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/checkout')}
                      className="mt-2"
                    >
                      Return to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
