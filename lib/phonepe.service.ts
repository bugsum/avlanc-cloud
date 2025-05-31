// Environment configuration
const ENV = {
  // OAuth2 Credentials
  CLIENT_ID: process.env.PHONEPE_CLIENT_ID!,
  CLIENT_SECRET: process.env.PHONEPE_CLIENT_SECRET!,
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID!,
  SALT_KEY: process.env.PHONEPE_SALT_KEY!,
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  
  // API Endpoints
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com'
    : 'https://api-preprod.phonepe.com',
  
  AUTH_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
  
  PAYMENT_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/pg/checkout/v2/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
  
  // Webhook
  WEBHOOK_USERNAME: process.env.PHONEPE_WEBHOOK_USERNAME!,
  WEBHOOK_PASSWORD: process.env.PHONEPE_WEBHOOK_PASSWORD!,
  
  // Application
  APP_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  REDIRECT_URL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/callback`
};

// Types
export type PaymentState = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface PaymentRequest {
  merchantOrderId: string;
  amount: number; // in paisa (1 INR = 100 paisa)
  expireAfter?: number; // in seconds (default: 1200)
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    [key: string]: any;
  };
  paymentFlow: {
    type: 'PG_CHECKOUT';
    message?: string;
    merchantUrls: {
      redirectUrl: string;
    };
    paymentModeConfig?: {
      enabledPaymentModes?: Array<{
        type: 'UPI_INTENT' | 'UPI_COLLECT' | 'UPI_QR' | 'NET_BANKING' | 'CARD';
        cardTypes?: Array<'DEBIT_CARD' | 'CREDIT_CARD'>;
      }>;
      disabledPaymentModes?: Array<{
        type: 'UPI_INTENT' | 'UPI_COLLECT' | 'UPI_QR' | 'NET_BANKING' | 'CARD';
        cardTypes?: Array<'DEBIT_CARD' | 'CREDIT_CARD'>;
      }>;
    };
  };
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  state?: PaymentState;
  redirectUrl?: string;
  expireAt?: number;
  message?: string;
  error?: string;
  code?: string;
}

interface TokenResponse {
  access_token: string;
  encrypted_access_token: string;
  expires_in: number | null;
  issued_at: number;
  expires_at: number;
  session_expires_at: number;
  token_type: 'O-Bearer';
}

interface WebhookPayload {
  merchantId: string;
  merchantOrderId: string;
  transactionId: string;
  amount: number;
  state: PaymentState;
  paymentState: string;
  paymentMessage: string;
  paymentTime: number;
  [key: string]: any;
}

// Token management
const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds
let tokenCache: {
  accessToken: string;
  expiresAt: number;
} | null = null;

/**
 * Fetches a new access token from PhonePe OAuth2 endpoint
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if it's still valid
  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_REFRESH_THRESHOLD * 1000) {
    return tokenCache.accessToken;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('client_id', ENV.CLIENT_ID);
    formData.append('client_secret', ENV.CLIENT_SECRET);
    formData.append('grant_type', 'client_credentials');
    formData.append('client_version', ENV.SALT_INDEX);

    const response = await fetch(ENV.AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to get access token: ${response.status} - ${error}`);
    }

    const data: TokenResponse = await response.json();

    console.log("Response", data)
    
    // Cache the token
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: data.expires_at * 1000, // Convert to milliseconds
    };

    return tokenCache.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with PhonePe');
  }
}

/**
 * Initiates a PhonePe payment
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const accessToken = await getAccessToken();
    
    // Generate a unique merchant transaction ID if not provided
    const merchantTransactionId = request.merchantOrderId || `TXN_${Date.now()}`;
    
    // Define the base payload with required fields
    const basePayload = {
      merchantId: ENV.MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: `USER_${Date.now()}`,
      amount: request.amount,
      redirectUrl: request.merchantRedirectUrl || ENV.REDIRECT_URL,
      redirectMode: 'POST' as const,
      callbackUrl: request.merchantCallbackUrl || ENV.REDIRECT_URL,
      mobileNumber: request.customer?.phone,
      paymentInstrument: {
        type: 'PAY_PAGE' as const,
      },
      // Add default expiry time if not provided
      expiry: request.expiresIn 
        ? new Date(Date.now() + request.expiresIn * 1000).toISOString()
        : new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes default
    };

    // Create the full payload with optional fields
    const payload = {
      ...basePayload,
      // Add payment flow if provided
      ...(request.paymentFlow && { paymentFlow: request.paymentFlow }),
      // Add customer details if provided
      ...(request.customer && { customer: request.customer }),
      // Add metadata if provided
      ...(request.metadata && { metadata: request.metadata }),
      // Add payment modes if provided
      ...(request.paymentModes && request.paymentModes.length > 0 && { 
        paymentModes: request.paymentModes 
      })
    };

    const response = await fetch(ENV.PAYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-MERCHANT-ID': ENV.MERCHANT_ID,
      },
      body: JSON.stringify({
        request: Buffer.from(JSON.stringify(payload)).toString('base64'),
      }),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => 'Failed to initiate payment');
      throw new Error(`Payment initiation failed: ${response.status} - ${error}`);
    }

    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.message || 'Payment initiation failed');
    }

    return {
      success: true,
      orderId: merchantTransactionId,
      redirectUrl: responseData.data.instrumentResponse?.redirectInfo?.url,
      state: 'PENDING' as const,
      expireAt: Date.now() + (request.expiresIn || 30 * 60 * 1000), // Default 30 minutes
      code: responseData.code,
      message: responseData.message,
    };
  } catch (error) {
    console.error('Error initiating payment:', error);
    return {
      success: false,
      state: 'FAILED' as const,
      error: error instanceof Error ? error.message : 'Failed to initiate payment',
      code: 'PAYMENT_INITIATION_FAILED',
    };
  }
}

/**
 * Verifies webhook signature and processes the webhook payload
 */
export async function processWebhook(
  authHeader: string | null,
  payload: WebhookPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify basic auth
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return { success: false, error: 'Missing or invalid authorization header' };
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== ENV.WEBHOOK_USERNAME || password !== ENV.WEBHOOK_PASSWORD) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Validate webhook payload
    if (!payload.merchantOrderId || !payload.transactionId || !payload.amount) {
      return { success: false, error: 'Invalid webhook payload' };
    }

    // Process the webhook based on payment state
    const { state, merchantOrderId, transactionId, amount } = payload;
    
    // Log the webhook for debugging
    console.log('Processing webhook:', { 
      state, 
      merchantOrderId, 
      transactionId, 
      amount,
      paymentState: payload.paymentState,
      paymentMessage: payload.paymentMessage,
      paymentTime: payload.paymentTime ? new Date(payload.paymentTime).toISOString() : null
    });

    // TODO: Update your database with the payment status
    // This is where you would typically update your database with the payment status
    // For example:
    // await updatePaymentStatus(merchantOrderId, {
    //   transactionId,
    //   status: state,
    //   amount,
    //   paymentTime: payload.paymentTime ? new Date(payload.paymentTime) : new Date(),
    //   paymentMessage: payload.paymentMessage,
    //   paymentState: payload.paymentState,
    //   rawResponse: JSON.stringify(payload)
    // });

    return { success: true };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process webhook' 
    };
  }
}

/**
 * Creates a payment request with default values
 */
export function createPaymentRequest(
  amount: number,
  orderId: string,
  customer: {
    name: string;
    email: string;
    phone: string;
  },
  redirectUrl?: string
): PaymentRequest {
  return {
    merchantOrderId: orderId,
    amount: Math.round(amount * 100), // Convert to paisa
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: `Payment for order ${orderId}`,
      merchantUrls: {
        redirectUrl: redirectUrl || ENV.REDIRECT_URL,
      },
    },
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
    metaInfo: {
      udf1: `Order ${orderId}`,
      udf2: customer.email,
      udf3: customer.phone,
    },
  };
}
