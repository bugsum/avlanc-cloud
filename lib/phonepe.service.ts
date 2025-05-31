import { createHash } from 'crypto';

// Environment configuration
const ENV = {
  // OAuth2 Credentials
  CLIENT_ID: process.env.NEXT_PUBLIC_PHONEPE_CLIENT_ID!,
  CLIENT_SECRET: process.env.NEXT_PUBLIC_PHONEPE_CLIENT_SECRET!,
  MERCHANT_ID: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID!,
  SALT_KEY: process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY!,
  SALT_INDEX: process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX || '1',

  // API Endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL || 'https://api-preprod.phonepe.com',

  AUTH_URL: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL}/apis/merchant/authentication`
    : 'https://api-preprod.phonepe.com/apis/merchant/authentication',

  PAYMENT_URL: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL}/apis/pg-sandbox/checkout/v2/pay`
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',

  // Webhook
  WEBHOOK_USERNAME: process.env.PHONEPE_WEBHOOK_USERNAME!,
  WEBHOOK_PASSWORD: process.env.PHONEPE_WEBHOOK_PASSWORD!,

  // Application
  APP_BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://avlanc.com',
  REDIRECT_URL: process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL || '',
  CALLBACK_URL: process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL || '',
};

// Types
export type PaymentState = 'PENDING' | 'COMPLETED' | 'FAILED';
export type RefundState = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface OrderStatusResponse {
  orderId: string;
  state: PaymentState;
  amount: number;
  expireAt?: number;
  paymentDetails?: Array<{
    transactionId: string;
    paymentMode: string;
    timestamp: number;
    amount: number;
    state: PaymentState;
    rail?: {
      type: string;
      utr?: string;
      upiTransactionId?: string;
      vpa?: string;
    };
    instrument?: {
      type: string;
      maskedAccountNumber?: string;
      accountType?: string;
    };
    errorCode?: string;
    detailedErrorCode?: string;
  }>;
  errorContext?: {
    errorCode: string;
    detailedErrorCode: string;
    source: string;
    stage: string;
    description: string;
  };
}

export interface RefundRequest {
  merchantRefundId: string;
  originalMerchantOrderId: string;
  amount: number; // in paisa
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  state: RefundState;
  amount: number;
  message?: string;
  error?: string;
}

export interface RefundStatusResponse {
  originalMerchantOrderId: string;
  amount: number;
  state: RefundState;
  timestamp: number;
  refundId: string;
  errorCode?: string;
  detailedErrorCode?: string;
  splitInstruments?: Array<{
    amount: number;
    rail?: {
      type: string;
      utr?: string;
      upiTransactionId?: string;
      vpa?: string;
    };
    instrument?: {
      type: string;
      maskedAccountNumber?: string;
      accountType?: string;
    };
  }>;
}

export interface PaymentRequest {
  merchantOrderId: string;
  amount: number; // in paisa (1 INR = 100 paisa)
  customer: {
    name?: string;
    email: string;
    phone: string;
  };
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    [key: string]: any;
  };
  paymentFlow?: {
    type: 'PG_CHECKOUT';
    message?: string;
    merchantUrls: {
      redirectUrl: string;
      callbackUrl?: string;
    };
  };
  expireAfter?: number; // in seconds
  merchantUrls?: {
    redirectUrl: string;
    callbackUrl?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  state?: PaymentState;
  redirectUrl?: string;
  tokenUrl?: string; // For iframe mode
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
 * Fetches a new access token from our server-side auth endpoint
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if it's still valid
  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_REFRESH_THRESHOLD * 1000) {
    return tokenCache.accessToken;
  }

  try {
    const response = await fetch(`${ENV.APP_BASE_URL}/api/payment/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to get access token: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.success || !data.token) {
      throw new Error(data.error || 'Failed to get access token');
    }

    // Cache the token
    tokenCache = {
      accessToken: data.token,
      expiresAt: Date.now() + (data.expiresIn * 1000), // Convert to milliseconds
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
export async function initiatePayment(
  request: PaymentRequest,
  options: { mode?: 'REDIRECT' | 'IFRAME' } = { mode: 'REDIRECT' }
): Promise<PaymentResponse> {
  try {
    console.log('Starting payment initiation...');
    const accessToken = await getAccessToken();
    console.log('Got access token');

    // Generate a unique merchant transaction ID if not provided
    const merchantTransactionId = request.merchantOrderId || `TXN_${Date.now()}`;

    // Define the base payload with required fields
    const basePayload = {
      merchantId: ENV.MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: `USER_${Date.now()}`,
      amount: request.amount,
      redirectUrl: request.merchantUrls?.redirectUrl || ENV.REDIRECT_URL,
      redirectMode: 'POST' as const,
      callbackUrl: request.merchantUrls?.callbackUrl || ENV.CALLBACK_URL,
      mobileNumber: request.customer?.phone,
      paymentInstrument: {
        type: 'PAY_PAGE' as const,
      },
      // Add default expiry time if not provided
      expiry: request.expireAfter
        ? new Date(Date.now() + request.expireAfter * 1000).toISOString()
        : new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes default
    };

    console.log('Payment payload:', {
      ...basePayload,
      // Don't log sensitive data
      merchantId: basePayload.merchantId,
      amount: basePayload.amount,
      redirectUrl: basePayload.redirectUrl,
      callbackUrl: basePayload.callbackUrl,
    });

    const paymentUrl = `${ENV.API_BASE_URL}/apis/pg-sandbox/checkout/v2/pay`;
    console.log('Payment URL:', paymentUrl);

    const response = await fetch(paymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(basePayload),
    });

    console.log('Payment response status:', response.status);
    const data = await response.json();
    console.log('Payment response data:', data);

    if (!response.ok) {
      console.error('Payment initiation failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      return {
        success: false,
        error: data.message || 'Failed to initiate payment',
        code: data.code,
      };
    }

    // For iframe mode, we need to return the token URL directly
    if (options.mode === 'IFRAME') {
      return {
        success: true,
        orderId: data.data.merchantOrderId,
        state: 'PENDING',
        redirectUrl: data.data.url,
        tokenUrl: data.data.url, // This is the URL to be used in iframe
      };
    }

    return {
      success: true,
      orderId: data.data.merchantOrderId,
      state: 'PENDING',
      redirectUrl: data.data.url,
    };
  } catch (error) {
    console.error('Error initiating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
}

/**
 * Fetches the status of a refund
 * @param merchantRefundId The merchant's refund ID
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

export interface PhonePeConfig {
  merchantId: string;
  clientId: string;
  clientSecret: string;
  saltKey: string;
  saltIndex: number;
  apiBaseUrl: string;
  redirectUrl: string;
  callbackUrl: string;
}

export interface PaymentStatus {
  success: boolean;
  state: PaymentState;
  transactionId?: string;
  amount?: number;
  currency?: string;
  timestamp?: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  merchantOrderId: string;
  transactionId: string;
  amount: number; // in paisa
  reason?: string;
}

// PhonePe Service Class
export class PhonePeService {
  private static instance: PhonePeService;
  private config: PhonePeConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private constructor(config: PhonePeConfig) {
    this.config = config;
  }

  public static getInstance(config: PhonePeConfig): PhonePeService {
    if (!PhonePeService.instance) {
      PhonePeService.instance = new PhonePeService(config);
    }
    return PhonePeService.instance;
  }

  private generateXVerify(payload: string, path: string): string {
    const baseString = payload + path + this.config.saltKey;
    return createHash('sha256').update(baseString).digest('hex');
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('client_id', this.config.clientId);
      formData.append('client_secret', this.config.clientSecret);
      formData.append('grant_type', 'client_credentials');

      const response = await fetch(`${this.config.apiBaseUrl}/apis/merchant/authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Authentication response:', data);
        throw new Error(data.message || 'Failed to get access token');
      }

      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('No access token received');
      }

      this.accessToken = data.token;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000);
      
      return data.token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with PhonePe');
    }
  }

  public async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      // Prepare the payload
      const payload = {
        merchantId: this.config.merchantId,
        merchantTransactionId: request.merchantOrderId,
        merchantUserId: `USER_${Date.now()}`,
        amount: request.amount,
        redirectUrl: request.paymentFlow?.merchantUrls.redirectUrl || this.config.redirectUrl,
        redirectMode: 'POST',
        callbackUrl: request.paymentFlow?.merchantUrls.callbackUrl || this.config.callbackUrl,
        mobileNumber: request.customer.phone,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
        metaInfo: request.metaInfo,
        expiry: request.expireAfter
          ? new Date(Date.now() + request.expireAfter * 1000).toISOString()
          : new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes default
      };

      console.log('Payment payload:', payload);

      const response = await fetch(
        `${this.config.apiBaseUrl}/apis/pg-sandbox/checkout/v2/pay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'X-CLIENT-ID': this.config.clientId,
            'X-CLIENT-SECRET': this.config.clientSecret,
            'X-VERIFY': this.generateXVerify(JSON.stringify(payload), '/apis/pg-sandbox/checkout/v2/pay'),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log('Payment response:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to initiate payment',
          code: data.code,
        };
      }

      return {
        success: true,
        orderId: data.data.merchantOrderId,
        state: 'PENDING',
        redirectUrl: data.data.url,
        expireAt: new Date(data.data.expiry).getTime(),
      };
    } catch (error) {
      console.error('Error initiating payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate payment',
      };
    }
  }

  public async checkPaymentStatus(merchantTransactionId: string): Promise<PaymentStatus> {
    try {
      const accessToken = await this.getAccessToken();
      const path = `/apis/pg-sandbox/status/${this.config.merchantId}/${merchantTransactionId}`;

      const response = await fetch(`${this.config.apiBaseUrl}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-VERIFY': this.generateXVerify('', path),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check payment status');
      }

      return {
        success: data.data.state === 'COMPLETED',
        state: data.data.state,
        transactionId: data.data.transactionId,
        amount: data.data.amount / 100, // Convert from paise to currency
        currency: data.data.currency,
        timestamp: data.data.responseTimestamp,
        message: data.message,
        metadata: data.data,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Failed to check payment status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  public async initiateRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const path = `/apis/pg-sandbox/refund`;

      const payload = {
        merchantId: this.config.merchantId,
        merchantTransactionId: request.merchantOrderId,
        merchantUserId: `USER_${Date.now()}`,
        originalTransactionId: request.transactionId,
        amount: request.amount,
        callbackUrl: this.config.callbackUrl,
        reason: request.reason || 'Customer requested refund',
      };

      const response = await fetch(`${this.config.apiBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-VERIFY': this.generateXVerify(JSON.stringify(payload), path),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          refundId: '',
          state: 'FAILED',
          amount: request.amount,
          error: data.message || 'Failed to initiate refund',
        };
      }

      return {
        success: true,
        refundId: data.data.refundId,
        state: data.data.state,
        amount: request.amount,
        message: data.message,
      };
    } catch (error) {
      console.error('Error initiating refund:', error);
      return {
        success: false,
        refundId: '',
        state: 'FAILED',
        amount: request.amount,
        error: error instanceof Error ? error.message : 'Failed to initiate refund',
      };
    }
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    const calculatedSignature = this.generateXVerify(payload, '');
    return calculatedSignature === signature;
  }
}
