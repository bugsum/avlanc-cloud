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
    // Log environment variables (without sensitive data)
    console.log('API Base URL:', process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL);
    console.log('Merchant ID:', process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID);
    console.log('Redirect URL:', process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL);
    console.log('Callback URL:', process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL);

    const body = await request.json();
    console.log('Received payment request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.merchantOrderId || !body.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: merchantOrderId and amount are required' },
        { status: 400 }
      );
    }

    const paymentRequest: PaymentRequest = {
      merchantOrderId: body.merchantOrderId,
      amount: body.amount,
      expireAfter: body.expireAfter || 1200, // Default 20 minutes
      metaInfo: body.metaInfo || {},
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: body.message || 'Payment for order',
        merchantUrls: {
          redirectUrl: body.merchantUrls?.redirectUrl || process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL!,
        },
        paymentModeConfig: body.paymentModeConfig || {
          enabledPaymentModes: [
            { type: 'UPI_INTENT' },
            { type: 'UPI_COLLECT' },
            { type: 'UPI_QR' },
            { type: 'NET_BANKING' },
            { type: 'CARD', cardTypes: ['DEBIT_CARD', 'CREDIT_CARD'] }
          ]
        },
      },
    };

    console.log('Constructed payment request:', JSON.stringify(paymentRequest, null, 2));

    const response = await phonePeService.initiatePayment(paymentRequest);
    console.log('Payment initiation response:', JSON.stringify(response, null, 2));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Detailed error in payment processing:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Failed to process payment request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 