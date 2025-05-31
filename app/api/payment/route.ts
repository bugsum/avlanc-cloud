import { NextResponse } from 'next/server';
import { initiatePhonePePayment, checkPaymentStatus, PaymentRequest, PaymentStatus } from '@/lib/phonepe';
import { v4 as uuidv4 } from 'uuid';

// This route needs to be dynamic as it handles server-side operations
export const dynamic = 'force-dynamic';

// Disable static generation for this route
export const revalidate = 0;


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

// Common response headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        { status: 400, headers }
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
        { status: 400, headers }
      );
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      merchantOrderId: requestData.orderId,
      amount: Math.round(parseFloat(requestData.amount) * 100), // Convert to paise
      customer: {
        name: requestData.customer.name,
        email: requestData.customer.email,
        phone: requestData.customer.phone.toString(),
      },
      merchantRedirectUrl: requestData.redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      merchantCallbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      paymentModes: requestData.paymentModes,
      expiresIn: requestData.expiresIn || 1800, // 30 minutes default
      metadata: {
        ...(requestData.metadata || {}),
        ...(requestData.customer.address && { address: requestData.customer.address }),
        ...(requestData.customer.city && { city: requestData.customer.city }),
        ...(requestData.customer.state && { state: requestData.customer.state }),
        ...(requestData.customer.zip && { zip: requestData.customer.zip }),
        ...(Array.isArray(requestData.items) && { items: JSON.stringify(requestData.items) }),
      },
    };

    // Initiate payment with PhonePe
    const response = await initiatePhonePePayment(paymentRequest);
    
    if (!response.success) {
      return NextResponse.json(
        { 
          success: false,
          error: response.message || 'Failed to initiate payment',
          code: response.code,
        },
        { 
          status: response.code === 'BAD_REQUEST' ? 400 : 500, 
          headers 
        }
      );
    }

    // Extract the necessary data from the response
    const responseData = response.data;
    
    if (!responseData) {
      throw new Error('No data received from payment gateway');
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: responseData.merchantId,
        transactionId: responseData.merchantTransactionId,
        redirectUrl: responseData.redirectUrl,
        callbackUrl: responseData.callbackUrl,
      },
      message: 'Payment initiated successfully',
    }, { headers });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500, headers }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');
    
    if (!orderId && !transactionId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Either orderId or transactionId is required' 
        },
        { status: 400, headers }
      );
    }

    // Check payment status
    const status = await checkPaymentStatus(transactionId || orderId!);
    
    return NextResponse.json({
      success: true,
      data: status,
    }, { headers });
    
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check payment status',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500, headers }
    );
  }
}
