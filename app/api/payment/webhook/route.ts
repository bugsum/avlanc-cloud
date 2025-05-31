import { NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/phonepe/service';
import { phonePeConfig } from '@/lib/config';
import { WebhookPayload } from '@/lib/phonepe/types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-VERIFY',
  'Content-Type': 'application/json',
};

// Initialize PhonePe service
const phonePeService = PhonePeService.getInstance(phonePeConfig);

export async function POST(request: Request) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('X-VERIFY');
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get the raw body for signature verification
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody) as WebhookPayload;

    // Verify the signature
    if (!phonePeService.verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Process the webhook
    console.log('Processing webhook:', {
      merchantOrderId: payload.merchantOrderId,
      transactionId: payload.transactionId,
      amount: payload.amount,
      state: payload.state,
      paymentState: payload.paymentState,
      paymentMessage: payload.paymentMessage,
      paymentTime: payload.paymentTime ? new Date(payload.paymentTime).toISOString() : null,
    });

    // TODO: Update your database with the payment status
    // This is where you would typically update your database with the payment status
    // For example:
    // await updatePaymentStatus(payload.merchantOrderId, {
    //   transactionId: payload.transactionId,
    //   status: payload.state,
    //   amount: payload.amount,
    //   paymentTime: payload.paymentTime ? new Date(payload.paymentTime) : new Date(),
    //   paymentMessage: payload.paymentMessage,
    //   paymentState: payload.paymentState,
    //   rawResponse: rawBody,
    // });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process webhook',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 