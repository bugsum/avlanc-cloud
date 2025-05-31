export type PaymentState = 'PENDING' | 'COMPLETED' | 'FAILED';
export type RefundState = 'PENDING' | 'COMPLETED' | 'FAILED';

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

export interface PaymentRequest {
  merchantOrderId: string;
  amount: number; // in paisa
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
  merchantUrls?: {
    redirectUrl: string;
    callbackUrl?: string;
  };
  expireAfter?: number; // in seconds
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  state?: PaymentState;
  redirectUrl?: string;
  tokenUrl?: string;
  expireAt?: number;
  message?: string;
  error?: string;
  code?: string;
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

export interface RefundResponse {
  success: boolean;
  refundId: string;
  state: RefundState;
  amount: number;
  message?: string;
  error?: string;
}

export interface WebhookPayload {
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