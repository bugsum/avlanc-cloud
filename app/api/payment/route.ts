import { NextRequest, NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/payment/phonepe.service';
import { PaymentRequest } from '@/lib/payment/types';

// Initialize PhonePe service with configuration
const phonePeService = PhonePeService.getInstance({
  merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID!,
  clientId: process.env.PHONEPE_CLIENT_ID!,
  clientSecret: process.env.PHONEPE_CLIENT_SECRET!,
  clientVersion: process.env.PHONEPE_CLIENT_VERSION!,
  saltKey: process.env.PHONEPE_SALT_KEY!,
  saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1'),
  apiBaseUrl: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL!,
  redirectUrl: process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL!,
  callbackUrl: process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentRequest: PaymentRequest = {
      merchantOrderId: body.merchantOrderId,
      amount: body.amount,
      expireAfter: body.expireAfter,
      metaInfo: body.metaInfo,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: body.message,
        merchantUrls: {
          redirectUrl: body.merchantUrls?.redirectUrl,
        },
        paymentModeConfig: body.paymentModeConfig,
      },
    };

    const response = await phonePeService.initiatePayment(paymentRequest);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing payment request:', error);
    return NextResponse.json(
      { error: 'Failed to process payment request' },
      { status: 500 }
    );
  }
} 