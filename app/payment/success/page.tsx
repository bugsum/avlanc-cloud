'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhonePeService } from '@/lib/payment/phonepe.service';

// Initialize PhonePe service with configuration
const phonePeService = PhonePeService.getInstance({
  merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID!,
  clientId: process.env.PHONEPE_CLIENT_ID!,
  clientSecret: process.env.PHONEPE_CLIENT_SECRET!,
  clientVersion: process.env.PHONEPE_CLIENT_VERSION!,
  apiBaseUrl: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL!,
  redirectUrl: process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL!,
  callbackUrl: process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL!,
});

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying payment status...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const merchantTransactionId = searchParams.get('merchantTransactionId');
        if (!merchantTransactionId) {
          throw new Error('Missing transaction ID');
        }

        const paymentStatus = await phonePeService.checkPaymentStatus(merchantTransactionId);
        if (paymentStatus.state === 'COMPLETED') {
          setStatus('success');
          setMessage('Payment successful! Thank you for your purchase.');
          // TODO: Update order status in your database
        } else {
          setStatus('error');
          setMessage(paymentStatus.errorContext?.description || 'Payment failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to verify payment status');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          )}
          
          {status === 'success' && (
            <div className="text-green-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-4">
            {status === 'loading' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'error' && 'Payment Failed'}
          </h1>

          <p className="text-gray-600 mb-8">{message}</p>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
} 