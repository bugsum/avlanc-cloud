'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PhonePeService } from '@/lib/payment/phonepe.service';
import { PaymentStatusCheck } from '@/lib/payment/types';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Verifying payment status...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const merchantTransactionId = searchParams.get('merchantTransactionId');
        if (!merchantTransactionId) {
          setStatus('failed');
          setMessage('Invalid payment reference');
          return;
        }

        const phonePeService = PhonePeService.getInstance({
          merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID!,
          clientId: process.env.PHONEPE_CLIENT_ID!,
          clientSecret: process.env.PHONEPE_CLIENT_SECRET!,
          clientVersion: process.env.PHONEPE_CLIENT_VERSION!,
          apiBaseUrl: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL!,
          redirectUrl: process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL!,
          callbackUrl: process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL!,
          saltKey: process.env.PHONEPE_CLIENT_SECRET!,
          saltIndex: parseInt(process.env.PHONEPE_CLIENT_VERSION || '1'),
        });

        const paymentStatus = await phonePeService.checkPaymentStatus(merchantTransactionId);
        
        if (paymentStatus.data.state === 'COMPLETED') {
          setStatus('success');
          setMessage('Payment successful! Thank you for your purchase.');
          // TODO: Update order status in your database
        } else if (paymentStatus.data.state === 'FAILED') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
        } else {
          setStatus('pending');
          setMessage('Payment is being processed. Please wait...');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('failed');
        setMessage('Error verifying payment status. Please contact support.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'pending' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          )}
          {status === 'success' && (
            <div className="text-green-500 text-5xl mb-4">✓</div>
          )}
          {status === 'failed' && (
            <div className="text-red-500 text-5xl mb-4">✕</div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'pending' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
          </h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
} 