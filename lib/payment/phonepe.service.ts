import { PhonePeConfig, PaymentRequest, PaymentResponse, PaymentStatus } from './types';
import crypto from 'crypto';

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
      // Don't log sensitive data
      saltKey: config.saltKey ? '***' : undefined,
      saltIndex: config.saltIndex,
    });
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
      console.log('Using existing access token, expires at:', new Date(this.tokenExpiry).toISOString());
      return this.accessToken;
    }

    try {
      console.log('Requesting new access token...');
      console.log('Environment:', this.config.apiBaseUrl.includes('preprod') ? 'UAT' : 'PROD');
      
      const formData = new URLSearchParams();
      formData.append('client_id', this.config.clientId);
      formData.append('client_version', this.config.clientVersion);
      formData.append('client_secret', this.config.clientSecret);
      formData.append('grant_type', 'client_credentials');

      // Use the identity manager URL for auth
      const authUrl = this.config.apiBaseUrl.includes('preprod') 
        ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token'
        : 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

      console.log('Token request details:', {
        url: authUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          client_id: this.config.clientId,
          client_version: this.config.clientVersion,
          grant_type: 'client_credentials',
          // Don't log sensitive data
          client_secret: this.config.clientSecret,
        },
      });

      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      console.log('Token response status:', response.status);
      console.log('Token response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Token response body:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Authentication failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(`Failed to authenticate with PhonePe: ${data.message || data.error || 'Unknown error'}`);
      }

      if (!data.access_token) {
        console.error('No access token in response:', data);
        throw new Error('No access token received from PhonePe');
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = data.expires_at * 1000; // Convert to milliseconds
      console.log('New access token obtained:', {
        token: this.accessToken.substring(0, 10) + '...',
        expiresAt: new Date(this.tokenExpiry).toISOString(),
        tokenType: data.token_type,
      });

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  public async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Initiating payment with request:', JSON.stringify(request, null, 2));
      const accessToken = await this.getAccessToken();
      const payload = JSON.stringify(request);
      const xVerify = this.generateXVerify(payload, '/pg/v1/pay');

      const paymentUrl = `${this.config.apiBaseUrl}/pg/v1/pay`;
      console.log('Payment request details:', {
        url: paymentUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken.substring(0, 10)}...`,
          'X-VERIFY': xVerify,
        },
        body: request,
      });

      const response = await fetch(paymentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
          'X-VERIFY': xVerify,
        },
        body: payload,
      });

      console.log('Payment response status:', response.status);
      console.log('Payment response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Payment response body:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Payment initiation failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(data.message || 'Failed to initiate payment');
      }

      return {
        orderId: data.orderId,
        state: data.state,
        expireAt: data.expireAt,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error('Error initiating payment:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  public async checkPaymentStatus(merchantOrderId: string): Promise<PaymentStatus> {
    try {
      console.log('Checking payment status for order:', merchantOrderId);
      const accessToken = await this.getAccessToken();
      const endpoint = `/pg/v1/status/${this.config.merchantId}/${merchantOrderId}`;
      const xVerify = this.generateXVerify('', endpoint);

      const statusUrl = `${this.config.apiBaseUrl}${endpoint}`;
      console.log('Status request details:', {
        url: statusUrl,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken.substring(0, 10)}...`,
          'X-VERIFY': xVerify,
        },
      });

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
          'X-VERIFY': xVerify,
        },
      });

      console.log('Status response status:', response.status);
      console.log('Status response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Status response body:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Status check failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(data.message || 'Failed to check payment status');
      }

      return data;
    } catch (error) {
      console.error('Error checking payment status:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      console.log('Verifying webhook signature for payload:', payload);
      const data = payload + '/pg/v1/webhook' + this.config.saltKey;
      const sha256 = crypto.createHash('sha256').update(data).digest('hex');
      const expectedSignature = sha256 + '###' + this.config.saltIndex;
      console.log('Signature verification:', {
        expected: expectedSignature,
        received: signature,
        matches: signature === expectedSignature,
      });
      return signature === expectedSignature;
    } catch (error) {
      console.error('Error verifying webhook signature:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      return false;
    }
  }
} 