export interface PaymentRequest {
    merchantOrderId: string;
    amount: number; // in paise
    customer: {
      name?: string;
      email: string;
      phone: string;
    };
    merchantUrls?: {
      redirectUrl: string;
      callbackUrl?: string;
    };
    expireAfter?: number; // in seconds
    metaInfo?: {
      items?: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
      }>;
      shipping?: {
        address: string;
        city: string;
        state: string;
        zip: string;
      };
      [key: string]: any;
    };
  }
  
  export interface PaymentResponse {
    success: boolean;
    redirectUrl?: string;
    orderId?: string;
    error?: string;
    code?: string;
  }
  
  export interface PaymentError extends Error {
    code?: string;
    details?: any;
  }