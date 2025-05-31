import { NextResponse } from 'next/server';
import { processWebhook } from '@/lib/phonepe.service';

// Disable body parsing, we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // Get the raw body as text for signature verification
    const rawBody = await readRawBody(request);
    if (!rawBody) {
      console.error('Empty request body');
      return NextResponse.json(
        { success: false, error: 'Empty request body' },
        { status: 400 }
      );
    }

    // Verify and process the webhook
    const authHeader = request.headers.get('authorization') || '';
    const result = await processWebhook(authHeader, JSON.parse(rawBody));

    if (!result.success) {
      console.error('Webhook processing failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Return success response to PhonePe
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to read raw body from request
async function readRawBody(request: Request): Promise<string | null> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();
  
  if (!reader) return null;
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    
    // Combine all chunks into a single buffer and convert to string
    const buffer = Buffer.concat(chunks);
    return buffer.toString('utf-8');
  } catch (error) {
    console.error('Error reading request body:', error);
    return null;
  } finally {
    reader.releaseLock();
  }
}
