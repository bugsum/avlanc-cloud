import { NextResponse } from 'next/server';

// Ensure this route is handled by the serverless function
export const dynamic = 'force-dynamic';

// Disable body parsing, we need the raw body
export const config = {
    api: {
        bodyParser: false,
    },
};

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

export async function POST(request: Request) {
    try {
        // Get the raw body as text
        const rawBody = await readRawBody(request);
        if (!rawBody) {
            console.error('Empty request body in callback');
            return NextResponse.json(
                { success: false, error: 'Empty request body' },
                { status: 400 }
            );
        }

        // Parse the callback data
        const callbackData = JSON.parse(rawBody);
        const { merchantOrderId, transactionId, state, code, message } =
            callbackData;

        if (!merchantOrderId) {
            console.error('Missing merchantOrderId in callback');
            return NextResponse.json(
                { success: false, error: 'Missing merchantOrderId' },
                { status: 400 }
            );
        }

        // Log the callback for debugging
        console.log('Received payment callback:', {
            merchantOrderId,
            transactionId,
            state,
            code,
            message,
        });

        // Prepare the redirect URL based on payment state
        const baseUrl = new URL(request.url).origin;
        let redirectUrl = `${baseUrl}/payment`;

        switch (state) {
            case 'COMPLETED':
                redirectUrl = `${baseUrl}/payment/success?orderId=${encodeURIComponent(
                    merchantOrderId
                )}`;
                if (transactionId) {
                    redirectUrl += `&transactionId=${encodeURIComponent(
                        transactionId
                    )}`;
                }
                break;

            case 'PENDING':
                redirectUrl = `${baseUrl}/payment/pending?orderId=${encodeURIComponent(
                    merchantOrderId
                )}`;
                if (transactionId) {
                    redirectUrl += `&transactionId=${encodeURIComponent(
                        transactionId
                    )}`;
                }
                break;

            case 'FAILED':
            default:
                redirectUrl = `${baseUrl}/payment/failed?orderId=${encodeURIComponent(
                    merchantOrderId
                )}`;
                if (code) {
                    redirectUrl += `&code=${encodeURIComponent(code)}`;
                }
                if (message) {
                    redirectUrl += `&message=${encodeURIComponent(message)}`;
                }
                break;
        }

        // Redirect to the appropriate page
        return NextResponse.redirect(redirectUrl, { status: 303 });
    } catch (error) {
        console.error('Error processing payment callback:', error);

        // Try to redirect to error page
        const baseUrl = new URL(request.url).origin;
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unexpected error occurred';
        const redirectUrl = `${baseUrl}/payment/error?message=${encodeURIComponent(
            errorMessage
        )}`;

        return NextResponse.redirect(redirectUrl, { status: 303 });
    }
}
