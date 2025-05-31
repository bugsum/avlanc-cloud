'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('Payment was not completed successfully.');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const txId = searchParams.get('transactionId');
    const errorCode = searchParams.get('error');
    
    if (txId) {
      setTransactionId(txId);
    }
    
    if (errorCode) {
      const errorMessages: Record<string, string> = {
        'invalid_parameters': 'Invalid payment parameters provided.',
        'payment_declined': 'Your payment was declined by the payment processor.',
        'insufficient_funds': 'Insufficient funds in your account.',
        'verification_failed': 'We could not verify your payment status.',
        'timeout': 'The payment request timed out.',
      };
      
      setError(errorMessages[errorCode] || 'An unknown error occurred during payment.');
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Unsuccessful</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          
          {transactionId && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-muted-foreground">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please contact support if you need assistance with this transaction.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => router.back()} variant="outline">
              Back to Checkout
            </Button>
            <Button onClick={() => router.push('/store')}>
              Continue Shopping
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>If you believe this is an error, please contact our support team.</p>
            <p className="mt-1">
              Email: <a href="mailto:support@avlanc.cloud" className="text-primary hover:underline">support@avlanc.cloud</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
