import { NextResponse } from 'next/server';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// For static export, we'll use a simpler approach
// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// This route will be statically exported
export const dynamic = 'auto';

export async function POST(request: Request) {
  try {
    // Parse request body
    let requestData;
    try {
      requestData = await request.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON'
        }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate required fields
    const requiredFields = ['amount', 'orderId', 'customer'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate customer fields
    const requiredCustomerFields = ['email', 'phone'];
    const missingCustomerFields = requiredCustomerFields.filter(
      field => !requestData.customer?.[field]
    );
    
    if (missingCustomerFields.length > 0) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          error: `Missing required customer fields: ${missingCustomerFields.join(', ')}` 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // For static export, return a message indicating client-side processing is needed
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'This API route is not available in static export. Please implement client-side payment processing.',
        code: 'CLIENT_SIDE_PROCESSING_REQUIRED'
      }),
      { status: 501, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process payment request',
        code: 'PAYMENT_PROCESSING_ERROR'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Payment processing implementation for server environments
/*
import { initiatePhonePePayment, checkPaymentStatus, PaymentRequest, PaymentStatus } from '@/lib/phonepe';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Validate required fields
    const requiredFields = ['amount', 'orderId', 'customer'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate customer fields
    const requiredCustomerFields = ['email', 'phone'];
    const missingCustomerFields = requiredCustomerFields.filter(
      field => !requestData.customer?.[field]
    );
    
    if (missingCustomerFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required customer fields: ${missingCustomerFields.join(', ')}` 
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      merchantOrderId: requestData.orderId,
      amount: Math.round(parseFloat(requestData.amount) * 100), // Convert to paise
      customer: {
        name: requestData.customer.name || '',
        email: requestData.customer.email,
        phone: requestData.customer.phone.toString(),
      },
      merchantRedirectUrl: requestData.redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      merchantCallbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      metadata: {
        items: requestData.items || [],
        ...(requestData.metadata || {})
      }
    };

    // Process payment (implementation depends on your payment provider)
    // const paymentResponse = await initiatePhonePePayment(paymentRequest);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: requestData.orderId,
          // transactionId: paymentResponse.transactionId,
          // redirectUrl: paymentResponse.redirectUrl
        }
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initiate payment',
        code: 'PAYMENT_INITIATION_ERROR'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
*/

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  if (!orderId && !transactionId) {
    return NextResponse.json(
      { success: false, error: 'Either orderId or transactionId is required' },
      { status: 400 }
    );
  }

  try {
    // Client-side implementation should be used instead
    // See documentation for implementing client-side payment processing
    return NextResponse.json(
      { success: true, data: {} }, // Replace with actual payment status
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check payment status',
        code: 'PAYMENT_STATUS_ERROR'
      },
      { status: 500 }
    );
  }
}
