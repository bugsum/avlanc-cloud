import { NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

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

    // TODO: Implement actual payment processing with your payment provider
    // For example, with PhonePe, Razorpay, Stripe, etc.
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          orderId: requestData.orderId,
          // Add payment provider specific response here
        } 
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process payment request',
        code: 'PAYMENT_PROCESSING_ERROR'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to process payments.',
      code: 'METHOD_NOT_ALLOWED'
    },
    { status: 405, headers: corsHeaders }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}
