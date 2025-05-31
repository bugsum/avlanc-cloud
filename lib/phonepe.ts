// Environment configuration
const ENV = {
  // OAuth2 Credentials
  PHONEPE_CLIENT_ID: process.env.PHONEPE_CLIENT_ID!,
  PHONEPE_CLIENT_SECRET: process.env.PHONEPE_CLIENT_SECRET!,
  PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID!,
  PHONEPE_SALT_KEY: process.env.PHONEPE_SALT_KEY!,
  PHONEPE_SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  
  // API Endpoints
  PHONEPE_BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com'
    : 'https://api-preprod.phonepe.com',
  
  PHONEPE_AUTH_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
  
  PHONEPE_PAYMENT_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/pg/checkout/v2/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
  
  // Webhook
  PHONEPE_WEBHOOK_USERNAME: process.env.PHONEPE_WEBHOOK_USERNAME!,
  PHONEPE_WEBHOOK_PASSWORD: process.env.PHONEPE_WEBHOOK_PASSWORD!,
  
  // Application
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  REDIRECT_URL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/callback`
};

// Interfaces
export interface PaymentRequest {
  merchantOrderId: string;
  amount: number; // Amount in paise (e.g., 10000 = ₹100.00)
  customer: {
    email: string;
    phone: string;
    name?: string;
  };
  merchantRedirectUrl?: string;
  merchantCallbackUrl?: string;
  paymentFlow?: 'DEFAULT' | 'NONE';
  paymentModes?: string[];
  expiresIn?: number; // in seconds (default: 30 minutes)
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    merchantUserId: string;
    amount: number;
    redirectUrl: string;
    redirectMode: string;
    callbackUrl: string;
    mobileNumber?: string;
    paymentInstrument?: {
      type: string;
      targetApp: string;
    };
  };
}

export interface WebhookPayload {
  merchantId: string;
  merchantTransactionId: string;
  transactionId: string;
  amount: number;
  state: 'COMPLETED' | 'FAILED' | 'PENDING';
  responseCode: string;
  paymentInstrument?: {
    type: string;
    utr?: string;
    cardType?: string;
    pgTransactionId?: string;
    bankTransactionId?: string;
    pgAuthorizationCode?: string;
    arn?: string;
    bankId?: string;
    brn?: string;
  };
  additionalInfo?: Record<string, any>;
  code?: string;
  message?: string;
}

// Token management
const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds
let tokenCache: {
  accessToken: string;
  expiresAt: number;
} | null = null;

// Constants
const DEFAULT_EXPIRY_TIME = 30 * 60; // 30 minutes in seconds

// Environment variables with fallbacks
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || '';
const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.phonepe.com'
  : 'https://api-preprod.phonepe.com';

// Helper function to get environment variable with fallback
function getEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

// Update the PaymentRequest interface to include all required properties
export interface PaymentRequest {
  merchantOrderId: string;
  amount: number;
  customer: {
    name?: string;
    email: string;
    phone: string;
  };
  merchantRedirectUrl?: string;
  merchantCallbackUrl?: string;
  paymentFlow?: 'DEFAULT' | 'NONE';
  paymentModes?: string[];
  expiresIn?: number;
  metadata?: Record<string, any>;
  // Add legacy properties for backward compatibility
  expireAfter?: number;
  metaInfo?: Record<string, any>;
  paymentInstrument?: {
    type: string;
    [key: string]: any;
  };
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
    formData.append('client_id', ENV.PHONEPE_CLIENT_ID);
    formData.append('client_secret', ENV.PHONEPE_CLIENT_SECRET);
    formData.append('grant_type', 'client_credentials');
    formData.append('client_version', ENV.PHONEPE_SALT_INDEX);

    const response = await fetch(ENV.PHONEPE_AUTH_URL, {
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

// Webhook authentication
const WEBHOOK_USERNAME = process.env.PHONEPE_WEBHOOK_USERNAME || 'YOUR_WEBHOOK_USERNAME';
const WEBHOOK_PASSWORD = process.env.PHONEPE_WEBHOOK_PASSWORD || 'YOUR_WEBHOOK_PASSWORD';

// Default expiry for payment links (5 minutes)
const DEFAULT_PAYMENT_EXPIRY_SECONDS = 300;
const PHONEPE_REDIRECT_URL = ENV.NEXT_PUBLIC_BASE_URL 
  ? `${ENV.NEXT_PUBLIC_BASE_URL}/api/payment/callback`
  : 'http://localhost:3000/api/payment/callback';

export async function initiatePhonePePayment(request: PaymentRequest): Promise<PaymentResponse> {
  const accessToken = await getAccessToken();
  
  const payload = {
    merchantId: ENV.PHONEPE_MERCHANT_ID,
    merchantOrderId: request.merchantOrderId,
    amount: request.amount,
    expireAfter: request.expireAfter || DEFAULT_PAYMENT_EXPIRY_SECONDS,
    metaInfo: request.metaInfo,
    paymentFlow: request.paymentFlow,
    customer: request.customer,
  };

  try {
    const response = await fetchWithRetry(ENV.PHONEPE_PAYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-VERIFY': generateXVerify(JSON.stringify(payload), '/pg/v1/pay'),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to initiate payment');
    }
    
    return {
      success: true,
      code: data.code,
      message: data.message,
      data: {
        merchantId: data.data.merchantId,
        merchantTransactionId: data.data.merchantTransactionId,
        merchantUserId: data.data.merchantUserId,
        amount: data.data.amount,
        redirectUrl: data.data.redirectUrl,
        redirectMode: data.data.redirectMode,
        callbackUrl: data.data.callbackUrl,
        mobileNumber: data.data.mobileNumber,
        paymentInstrument: data.data.paymentInstrument,
      },
    };
  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    throw new Error('Failed to initiate payment');
  }
}

function generateXVerify(payload: string, path: string) {
  const saltKey = process.env.PHONEPE_SALT_KEY || 'YOUR_SALT_KEY';
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  
  const crypto = require('crypto');
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  
  const hash = crypto
    .createHash('sha256')
    .update(payloadString + path + saltKey)
    .digest('hex');
    
  return hash + '###' + saltIndex;
}

// Status check intervals in milliseconds
const STATUS_CHECK_INTERVALS = [
  20000,  // First check after 20s
  ...Array(10).fill(3000),   // Then every 3s for 30s
  ...Array(10).fill(6000),   // Then every 6s for 60s
  ...Array(6).fill(10000),   // Then every 10s for 60s
  ...Array(2).fill(30000),   // Then every 30s for 60s
];

// Continue checking every 60s until terminal state or expiry
const FINAL_INTERVAL = 60000;

export interface PaymentStatus {
  success: boolean;
  state: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  amount?: number;
  currency?: string;
  timestamp?: number;
  message?: string;
  metadata?: Record<string, any>;
}

export async function checkPaymentStatus(merchantTransactionId: string): Promise<PaymentStatus> {
  const path = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
  
  try {
    const response = await fetchWithRetry(`${PHONEPE_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`,
        'X-VERIFY': generateXVerify('', path),
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check payment status');
    }
    
    return {
      success: data.code === 'PAYMENT_SUCCESS',
      state: data.data.state,
      transactionId: data.data.transactionId,
      amount: data.data.amount / 100, // Convert from paise to currency
      currency: data.data.currency,
      timestamp: data.data.responseTimestamp,
      message: data.message,
      metadata: data.data
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error('Failed to check payment status: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Webhook verification
export function verifyWebhookSignature(authHeader: string, payload: string): boolean {
  try {
    const expectedAuth = 'Basic ' + 
      Buffer.from(`${WEBHOOK_USERNAME}:${WEBHOOK_PASSWORD}`).toString('base64');
    return authHeader === expectedAuth;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Process webhook notification
export function processWebhookNotification(webhookData: any): PaymentStatus {
  try {
    // Verify the webhook payload structure
    if (!webhookData || !webhookData.payload || !webhookData.payload.payment) {
      throw new Error('Invalid webhook payload');
    }
    
    const payment = webhookData.payload.payment;
    
    return {
      success: payment.state === 'COMPLETED',
      state: payment.state,
      transactionId: payment.transactionId,
      amount: payment.amount / 100, // Convert from paise to currency
      currency: payment.currency,
      timestamp: payment.timestamp,
      message: payment.responseCode,
      metadata: payment
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw new Error('Invalid webhook data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Helper function to handle retries with token refresh
async function fetchWithRetry(url: string, options: RequestInit, retries = 1): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If unauthorized, try to refresh token and retry once
    if (response.status === 401 && retries > 0) {
      console.log('Token expired, refreshing...');
      const accessToken = await getAccessToken(); // Get new access token
      
      // Update authorization header with new token
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        }
      };
      
      return fetchWithRetry(url, newOptions, retries - 1);
    }
    
    return response;
  } catch (error) {
    if (retries <= 0) throw error;
    return fetchWithRetry(url, options, retries - 1);
  }
}

// Start token refresh scheduler
function startTokenRefreshScheduler() {
  const refreshInterval = 4.5 * 60 * 1000; // 4.5 minutes
  setInterval(async () => {
    try {
      await getAccessToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }, 4 * 60 * 60 * 1000); // Refresh every 4 hours
}

// Initialize token refresh scheduler when the module loads (server-side only)
if (typeof window === 'undefined') {
  startTokenRefreshScheduler();
}
