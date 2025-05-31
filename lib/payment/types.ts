export interface PaymentRequest {
    amount: number;
    orderId: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zip: string;
    };
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    expireAfter?: number;
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