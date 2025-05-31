'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const transactionId = searchParams.get('transactionId');
    if (!transactionId) {
      // Redirect to home if no transaction ID is provided
      router.push('/');
      return;
    }
    
    // Here you would typically fetch the order details using the transactionId
    // For now, we'll just store it in state
    setOrderId(transactionId);
  }, [searchParams, router]);

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">Order Details</p>
            <p className="text-sm text-muted-foreground mt-2">
              Transaction ID: <span className="font-mono">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email with your order details.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => router.push('/store')} variant="outline">
              Continue Shopping
            </Button>
            <Button onClick={() => router.push('/orders')}>
              View Order Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
