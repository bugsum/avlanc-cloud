import { PaymentRequest, PaymentResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class PaymentService {
  static async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      if (!data.redirectUrl) {
        throw new Error('No redirect URL received from payment gateway');
      }

      return {
        success: true,
        redirectUrl: data.redirectUrl,
        orderId: data.orderId,
      };
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to process payment'
      );
    }
  }
}