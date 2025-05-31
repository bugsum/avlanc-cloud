import { PhonePeConfig, PaymentRequest, PaymentResponse, PaymentStatus } from './types';

export class PhonePeService {
  private static instance: PhonePeService;
  private config: PhonePeConfig;
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  private constructor(config: PhonePeConfig) {
    this.config = config;
    console.log('PhonePeService initialized with config:', {
      merchantId: config.merchantId,
      clientId: config.clientId,
      clientVersion: config.clientVersion,
      apiBaseUrl: config.apiBaseUrl,
      redirectUrl: config.redirectUrl,
      callbackUrl: config.callbackUrl,
    });
  }

  public static getInstance(config: PhonePeConfig): PhonePeService {
    if (!PhonePeService.instance) {
      PhonePeService.instance = new PhonePeService(config);
    }
    return PhonePeService.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('client_id', this.config.clientId);
      formData.append('client_version', this.config.clientVersion);
      formData.append('client_secret', this.config.clientSecret);
      formData.append('grant_type', 'client_credentials');

      const authUrl = this.config.apiBaseUrl.includes('preprod')
        ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token'
        : 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        throw new Error(data.message || 'Failed to authenticate with PhonePe');
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = data.expires_at * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  public async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const paymentUrl = `${this.config.apiBaseUrl}/pg/v1/pay`;
      const response = await fetch(paymentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...request,
          paymentFlow: {
            ...request.paymentFlow,
            merchantUrls: {
              redirectUrl: this.config.redirectUrl,
              callbackUrl: this.config.callbackUrl,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate payment');
      }

      return data;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  public async checkPaymentStatus(merchantTransactionId: string): Promise<PaymentStatus> {
    try {
      const accessToken = await this.getAccessToken();

      const statusUrl = `${this.config.apiBaseUrl}/pg/v1/status/${this.config.merchantId}/${merchantTransactionId}`;
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
        },
      });

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