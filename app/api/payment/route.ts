import { NextResponse } from 'next/server';
import { initiatePayment, createPaymentRequest } from '@/lib/phonepe.service';

// Handle OPTIONS method for CORS preflight
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request: Request) {
  // Set CORS headers
  const headers = {
    ...corsHeaders,
    'Content-Type': 'application/json',
  };
  try {
    const requestData = await request.json();
    
    // Validate required fields
    const requiredFields = ['amount', 'orderId', 'customer'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400, headers }
      );
    }

    // Validate customer fields
    const requiredCustomerFields = ['name', 'email', 'phone'];
    const missingCustomerFields = requiredCustomerFields.filter(
      field => !requestData.customer?.[field]
    );
    
    if (missingCustomerFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required customer fields: ${missingCustomerFields.join(', ')}` },
        { status: 400, headers }
      );
    }

    // Create payment request
    const paymentRequest = createPaymentRequest(
      parseFloat(requestData.amount),
      requestData.orderId,
      {
        name: requestData.customer.name,
        email: requestData.customer.email,
        phone: requestData.customer.phone.toString(),
      },
      requestData.redirectUrl
    );

    // Add additional customer details if available
    if (requestData.customer.address) {
      paymentRequest.customer = {
        ...paymentRequest.customer,
        address: requestData.customer.address,
        ...(requestData.customer.city && { city: requestData.customer.city }),
        ...(requestData.customer.state && { state: requestData.customer.state }),
        ...(requestData.customer.zip && { zip: requestData.customer.zip }),
      };
    }

    // Add items to metadata if available
    if (Array.isArray(requestData.items) && requestData.items.length > 0) {
      paymentRequest.metaInfo = {
        ...paymentRequest.metaInfo,
        items: JSON.stringify(
          requestData.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
      };
    }

    // Add custom metadata if provided
    if (requestData.metadata && typeof requestData.metadata === 'object') {
      paymentRequest.metaInfo = {
        ...paymentRequest.metaInfo,
        ...requestData.metadata,
      };
    }

    // Set expiry if provided
    if (requestData.expireAfter) {
      paymentRequest.expireAfter = parseInt(requestData.expireAfter, 10);
    }

    // Initiate payment with PhonePe
    const response = await initiatePayment(paymentRequest);
    
    if (!response.success) {
      return NextResponse.json(
        { 
          success: false,
          error: response.error || 'Failed to initiate payment',
          code: response.code,
        },
        { status: response.code === 'BAD_REQUEST' ? 400 : 500, headers }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: response.orderId,
      redirectUrl: response.redirectUrl,
      expireAt: response.expireAt,
      message: 'Payment initiated successfully',
    }, { headers });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An error occurred' 
      },
      { status: 500, headers }
    );
  }
}
