import { NextRequest, NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/payment/phonepe.service';
import { PaymentRequest } from '@/lib/payment/types';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.merchantOrderId || !body.amount || !body.merchantUserId) {
      return NextResponse.json(
        { error: 'Missing required fields: merchantOrderId, amount, and merchantUserId are required' },
        { status: 400 }
      );
    }

    // Generate a unique transaction ID
    const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const paymentRequest: PaymentRequest = {
      merchantOrderId: body.merchantOrderId,
      amount: body.amount,
      merchantUserId: body.merchantUserId,
      merchantTransactionId,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: body.message || 'Payment for order',
        merchantUrls: {
          redirectUrl: body.redirectUrl || process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL!,
          callbackUrl: body.callbackUrl || process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL!,
        },
      },
      metaInfo: body.metaInfo || {},
    };

    const response = await phonePeService.initiatePayment(paymentRequest);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message || 'Failed to initiate payment' },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment request' },
      { status: 500 }
    );
  }
} 