import { NextResponse } from 'next/server';
import { verifyWebhookSignature, processWebhookNotification } from '@/lib/phonepe';

// This route needs to be dynamic as it handles server-side operations
export const dynamic = 'force-dynamic';

// Disable static generation for this route
export const revalidate = 0;


// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    // Get the authorization header
    const authHeader = request.headers.get('x-verify');
    
    // Parse the request body
    const payload = await request.json();
    
    // Verify the webhook signature
    if (!authHeader || !verifyWebhookSignature(authHeader, JSON.stringify(payload))) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401, headers }
      );
    }

    // Process the webhook notification
    const result = processWebhookNotification(payload);
    
    // Log the webhook for debugging
    console.log('Webhook received:', {
      transactionId: payload.data?.merchantTransactionId,
      status: payload.data?.state,
      amount: payload.data?.amount,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process webhook',
        code: 'WEBHOOK_PROCESSING_ERROR'
      },
      { status: 500, headers }
    );
  }
}
