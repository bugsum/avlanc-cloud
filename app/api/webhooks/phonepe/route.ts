import { NextRequest, NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/payment/phonepe.service';

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
    const signature = request.headers.get('x-verify');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const payload = await request.text();
    const isValid = phonePeService.verifyWebhookSignature(payload, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const data = JSON.parse(payload);
    console.log('Received webhook:', data);

    // TODO: Update your database with the payment status
    // const paymentStatus = await phonePeService.checkPaymentStatus(data.merchantTransactionId);
    // await updatePaymentInDatabase(data.merchantTransactionId, paymentStatus);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 