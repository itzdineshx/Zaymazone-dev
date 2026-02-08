import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function MockPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [paymentData, setPaymentData] = useState<any>(null);

  const orderId = searchParams.get('orderId');
  const mockOrderId = searchParams.get('mockOrderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Simulate payment processing
    const processMockPayment = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate payment success (90% success rate for testing)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          setPaymentStatus('success');
          setPaymentData({
            orderId,
            mockOrderId,
            amount: parseFloat(amount || '0'),
            transactionId: `MOCK_${Date.now()}`,
            paymentMethod: 'Mock Card'
          });

          // Simulate webhook call to update order status
          try {
            await api.verifyPayment({
              zohoPaymentId: mockOrderId,
              zohoOrderId: mockOrderId,
              paymentStatus: 'captured'
            });
          } catch (error) {
            console.log('Mock webhook simulation completed');
          }

          // Redirect to success page after 3 seconds
          setTimeout(() => {
            navigate('/payment-success', {
              state: {
                orderId,
                amount: parseFloat(amount || '0'),
                paymentMethod: 'Mock Payment'
              }
            });
          }, 3000);
        } else {
          setPaymentStatus('failed');
          setPaymentData({
            error: 'Payment failed - simulated failure for testing'
          });
        }
      } catch (error) {
        setPaymentStatus('failed');
        setPaymentData({
          error: 'Payment processing error'
        });
      }
    };

    if (orderId && mockOrderId && amount) {
      processMockPayment();
    } else {
      setPaymentStatus('failed');
      setPaymentData({
        error: 'Missing payment parameters'
      });
    }
  }, [orderId, mockOrderId, amount, navigate]);

  const handleRetry = () => {
    navigate('/checkout');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {paymentStatus === 'processing' && (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                Processing Payment
              </>
            )}
            {paymentStatus === 'success' && (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                Payment Successful
              </>
            )}
            {paymentStatus === 'failed' && (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                Payment Failed
              </>
            )}
          </CardTitle>
          <CardDescription>
            {paymentStatus === 'processing' && 'Please wait while we process your payment...'}
            {paymentStatus === 'success' && 'Your payment has been processed successfully!'}
            {paymentStatus === 'failed' && 'There was an issue processing your payment.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentData && (
            <div className="space-y-2 text-sm">
              {paymentData.orderId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{paymentData.orderId}</span>
                </div>
              )}
              {paymentData.amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">₹{paymentData.amount}</span>
                </div>
              )}
              {paymentData.transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">{paymentData.transactionId}</span>
                </div>
              )}
              {paymentData.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{paymentData.paymentMethod}</span>
                </div>
              )}
              {paymentData.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{paymentData.error}</p>
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="flex justify-center">
              <div className="animate-pulse text-muted-foreground">
                Do not close this window...
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Redirecting to confirmation page...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="w-full">
                Go Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}