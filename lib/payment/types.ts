export interface PhonePeConfig {
  merchantId: string;
  clientId: string;
  clientSecret: string;
  clientVersion: string;
  saltKey: string;
  saltIndex: number;
  apiBaseUrl: string;
  redirectUrl: string;
  callbackUrl: string;
}

export interface PaymentRequest {
  merchantOrderId: string;
  amount: number; // in paise
  expireAfter?: number; // in seconds, default 1200 (20 mins)
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
}

export interface PaymentResponse {
  orderId: string;
  state: PaymentState;
  expireAt: number;
  redirectUrl: string;
}

export type PaymentState = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface PaymentStatus {
  orderId: string;
  state: PaymentState;
  amount: number;
  expireAt: number;
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
  };
  paymentDetails: Array<{
    paymentMode: 'UPI_INTENT' | 'UPI_COLLECT' | 'UPI_QR' | 'NET_BANKING' | 'CARD';
    transactionId: string;
    timestamp: number;
    amount: number;
    state: PaymentState;
    errorCode?: string;
    detailedErrorCode?: string;
    rail?: {
      type: 'UPI' | 'PG';
      utr?: string;
      upiTransactionId?: string;
      vpa?: string;
    };
    instrument?: {
      type: 'ACCOUNT' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING';
      maskedAccountNumber?: string;
      accountType?: string;
      accountHolderName?: string;
    };
    splitInstruments?: Array<{
      amount: number;
      rail: {
        type: 'UPI' | 'PG' | 'PPI_WALLET';
        utr?: string;
        upiTransactionId?: string;
        vpa?: string;
      };
      instrument: {
        type: 'ACCOUNT' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET';
        maskedAccountNumber?: string;
        accountType?: string;
      };
    }>;
  }>;
  errorContext?: {
    errorCode: string;
    detailedErrorCode: string;
    source: string;
    stage: string;
    description: string;
  };
} 