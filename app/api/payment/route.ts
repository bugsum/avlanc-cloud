import { NextResponse } from 'next/server';
import { PhonePeService } from '@/lib/phonepe/service';
import { phonePeConfig } from '@/lib/config';
import { PaymentRequest } from '@/lib/phonepe/types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// Initialize PhonePe service
const phonePeService = PhonePeService.getInstance(phonePeConfig);

export async function POST(request: Request) {
  try {
    const body = await request.json() as PaymentRequest;
    
    console.log('Received payment request:', {
      merchantOrderId: body.merchantOrderId,
      amount: body.amount,
      customer: {
        name: body.customer?.name,
        email: body.customer?.email,
        phone: body.customer?.phone,
      },
      merchantUrls: body.merchantUrls,
    });

    // Validate required fields
    const missingFields = [];
    if (!body.merchantOrderId) missingFields.push('merchantOrderId');
    if (!body.amount) missingFields.push('amount');
    if (!body.customer?.phone) missingFields.push('customer.phone');
    if (!body.customer?.email) missingFields.push('customer.email');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          missingFields,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate amount is positive
    if (body.amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Amount must be greater than 0',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(body.customer.phone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone number format',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customer.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await phonePeService.initiatePayment(body);

    if (!response.success) {
      console.error('Payment initiation failed:', response.error);
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Payment initiated successfully:', {
      orderId: response.orderId,
      redirectUrl: response.redirectUrl,
    });

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process payment request',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}