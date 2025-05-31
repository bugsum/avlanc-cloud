import { NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/phonepe.service';
import { config } from '@/lib/config';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Initialize PhonePe service
const phonePeService = PhonePeService.getInstance(config.phonepe);

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Validate request data
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

    // Convert amount to paisa (PhonePe expects amount in paisa)
    const amountInPaisa = Math.round(requestData.amount * 100);

    // Process payment using PhonePe
    const paymentResponse = await phonePeService.initiatePayment({
      merchantOrderId: requestData.orderId,
      amount: amountInPaisa,
      customer: requestData.customer,
      metaInfo: {
        udf1: `Order ${requestData.orderId}`,
        udf2: requestData.customer.email,
        udf3: requestData.customer.phone,
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Payment for order ${requestData.orderId}`,
        merchantUrls: {
          redirectUrl: `${config.app.url}/payment/callback`,
          callbackUrl: `${config.app.url}/api/payment/webhook`,
        },
      },
      expireAfter: 1800, // 30 minutes
    });

    if (!paymentResponse.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: paymentResponse.error || 'Failed to initiate payment',
          code: paymentResponse.code,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        redirectUrl: paymentResponse.redirectUrl,
        orderId: paymentResponse.orderId,
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process payment',
        code: 'PAYMENT_PROCESSING_ERROR',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}