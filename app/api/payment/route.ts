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
    
    // Validate required fields
    if (!body.merchantOrderId || !body.amount || !body.customer?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await phonePeService.initiatePayment(body);

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 400, headers: corsHeaders }
      );
    }

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