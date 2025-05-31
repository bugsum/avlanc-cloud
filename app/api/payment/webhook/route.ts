// This is a placeholder for static export
// In a static export, webhooks need to be handled by an external service
// For production, you should set up a serverless function (e.g., Vercel Serverless, AWS Lambda)
// and configure PhonePe to send webhooks to that URL instead

import { NextResponse } from 'next/server';

export const dynamic = 'auto';

export async function POST() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Webhook handling requires serverless functions. Please deploy to a serverless environment.' 
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Webhook endpoint is not available in static export' 
    },
    { status: 404 }
  );
}
