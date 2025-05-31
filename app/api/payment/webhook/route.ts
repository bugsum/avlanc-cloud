import { NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/phonepe.service';
import { config } from '@/lib/config';

// Initialize PhonePe service
const phonePeService = PhonePeService.getInstance(config.phonepe);

export async function POST(request: Request) {
  try {
    // Get the raw body as text
    const rawBody = await request.text();
    if (!rawBody) {
      console.error('Empty webhook payload');
      return NextResponse.json(
        { success: false, error: 'Empty webhook payload' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const signature = request.headers.get('x-verify');
    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { success: false, error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    if (!phonePeService.verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(rawBody);
    const { merchantOrderId, transactionId, state, code, message } = webhookData;

    if (!merchantOrderId) {
      console.error('Missing merchantOrderId in webhook');
      return NextResponse.json(
        { success: false, error: 'Missing merchantOrderId' },
        { status: 400 }
      );
    }

    // Log the webhook for debugging
    console.log('Received payment webhook:', {
      merchantOrderId,
      transactionId,
      state,
      code,
      message,
    });

    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send confirmation emails
    // 3. Update inventory
    // 4. Trigger any other business logic

    // For now, we'll just acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process webhook',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-VERIFY',
    },
  });
} 