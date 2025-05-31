export interface PhonePeConfig {
  merchantId: string;
  clientId: string;
  clientSecret: string;
  clientVersion: string;
  apiBaseUrl: string;
  redirectUrl: string;
  callbackUrl: string;
  saltKey: string;
  saltIndex: number;
}

export interface PaymentRequest {
  merchantOrderId: string;
  amount: number;
  merchantUserId: string;
  merchantTransactionId: string;
  paymentFlow: {
    type: 'PG_CHECKOUT';
    message?: string;
    merchantUrls: {
      redirectUrl: string;
      callbackUrl: string;
    };
  };
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantTransactionId: string;
    merchantOrderId: string;
    redirectUrl: string;
    instrumentResponse: {
      type: string;
      redirectInfo: {
        url: string;
        method: string;
      };
    };
  };
}

export interface PaymentStatus {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantTransactionId: string;
    merchantOrderId: string;
    amount: number;
    state: 'PENDING' | 'COMPLETED' | 'FAILED';
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
      bankTransactionId?: string;
    };
  };
} 