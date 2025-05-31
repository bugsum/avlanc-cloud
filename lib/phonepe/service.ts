import { createHash } from 'crypto';
import {
  PhonePeConfig,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  RefundRequest,
  RefundResponse,
  WebhookPayload,
} from './types';

export class PhonePeService {
  private static instance: PhonePeService;
  private config: PhonePeConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds

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

      const payload = {
        merchantId: this.config.merchantId,
        merchantTransactionId: request.merchantOrderId,
        merchantUserId: `USER_${Date.now()}`,
        amount: request.amount,
        redirectUrl: request.merchantUrls?.redirectUrl || this.config.redirectUrl,
        redirectMode: 'POST' as const,
        callbackUrl: request.merchantUrls?.callbackUrl || this.config.callbackUrl,
        mobileNumber: request.customer.phone,
        paymentInstrument: {
          type: 'PAY_PAGE' as const,
        },
        metaInfo: request.metaInfo,
        expiry: request.expireAfter
          ? new Date(Date.now() + request.expireAfter * 1000).toISOString()
          : new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes default
      };

      const path = '/apis/pg-sandbox/checkout/v2/pay';
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
        amount: data.data.amount / 100,
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
      const path = '/apis/pg-sandbox/refund';

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