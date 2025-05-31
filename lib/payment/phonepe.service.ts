import { PhonePeConfig, PaymentRequest, PaymentResponse, PaymentStatus } from './types';
import crypto from 'crypto';

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

  private generateXVerify(payload: string, endpoint: string): string {
    try {
      const data = payload + endpoint + this.config.saltKey;
      console.log('Generating X-VERIFY for payload:', payload);
      console.log('Endpoint:', endpoint);
      const sha256 = crypto.createHash('sha256').update(data).digest('hex');
      const signature = sha256 + '###' + this.config.saltIndex;
      console.log('Generated X-VERIFY:', signature);
      return signature;
    } catch (error) {
      console.error('Error generating X-VERIFY:', error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      console.log('Using existing access token');
      return this.accessToken;
    }

    try {
      console.log('Requesting new access token...');
      const formData = new URLSearchParams();
      formData.append('client_id', this.config.clientId);
      formData.append('client_version', this.config.clientVersion);
      formData.append('client_secret', this.config.clientSecret);
      formData.append('grant_type', 'client_credentials');

      // Use the identity manager URL for auth
      const authUrl = this.config.apiBaseUrl.includes('preprod') 
        ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token'
        : 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

      console.log('Token request URL:', authUrl);
      console.log('Token request payload:', formData.toString());

      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Token response:', JSON.stringify(data, null, 2));

      if (!response.ok || !data.access_token) {
        console.error('Authentication response:', data);
        throw new Error(`Failed to authenticate with PhonePe: ${data.message || 'Unknown error'}`);
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = data.expires_at * 1000; // Convert to milliseconds
      console.log('New access token obtained, expires at:', new Date(this.tokenExpiry).toISOString());

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  public async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Initiating payment with request:', JSON.stringify(request, null, 2));
      const accessToken = await this.getAccessToken();
      const payload = JSON.stringify(request);
      const xVerify = this.generateXVerify(payload, '/pg/v1/pay');

      console.log('Making payment request to:', `${this.config.apiBaseUrl}/pg/v1/pay`);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
        'X-VERIFY': xVerify,
      });

      const response = await fetch(`${this.config.apiBaseUrl}/pg/v1/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
          'X-VERIFY': xVerify,
        },
        body: payload,
      });

      const data = await response.json();
      console.log('Payment response:', JSON.stringify(data, null, 2));

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
      console.log('Checking payment status for order:', merchantOrderId);
      const accessToken = await this.getAccessToken();
      const endpoint = `/pg/v1/status/${this.config.merchantId}/${merchantOrderId}`;
      const xVerify = this.generateXVerify('', endpoint);

      console.log('Making status request to:', `${this.config.apiBaseUrl}${endpoint}`);
      const response = await fetch(
        `${this.config.apiBaseUrl}${endpoint}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
            'X-VERIFY': xVerify,
          },
        }
      );

      const data = await response.json();
      console.log('Status response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check payment status');
      }

      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      console.log('Verifying webhook signature for payload:', payload);
      const data = payload + '/pg/v1/webhook' + this.config.saltKey;
      const sha256 = crypto.createHash('sha256').update(data).digest('hex');
      const expectedSignature = sha256 + '###' + this.config.saltIndex;
      console.log('Expected signature:', expectedSignature);
      console.log('Received signature:', signature);
      return signature === expectedSignature;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
} 