import { PhonePeConfig, PaymentRequest, PaymentResponse, PaymentStatus } from './types';

export class PhonePeService {
  private static instance: PhonePeService;
  private config: PhonePeConfig;
  private accessToken: string = '';
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

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('client_id', this.config.clientId);
      formData.append('client_version', this.config.clientVersion);
      formData.append('client_secret', this.config.clientSecret);
      formData.append('grant_type', 'client_credentials');

      const response = await fetch(`${this.config.apiBaseUrl}/v1/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        console.error('Authentication response:', data);
        throw new Error('Failed to authenticate with PhonePe');
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = data.expires_at * 1000; // Convert to milliseconds

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with PhonePe');
    }
  }

  public async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.config.apiBaseUrl}/checkout/v2/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate payment');
      }

      return {
        orderId: data.orderId,
        state: data.state,
        expireAt: data.expireAt,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  public async checkPaymentStatus(merchantOrderId: string): Promise<PaymentStatus> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `${this.config.apiBaseUrl}/checkout/v2/order/${merchantOrderId}/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check payment status');
      }

      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
} 