import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { serverConfig } from '@/lib/config';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function POST(request: Request) {
  try {
    console.log('Starting authentication process...');
    console.log('API Base URL:', process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL);
    
    const formData = new URLSearchParams();
    formData.append('client_id', serverConfig.phonepe.clientId);
    formData.append('client_secret', serverConfig.phonepe.clientSecret);
    formData.append('grant_type', 'client_credentials');

    console.log('Auth request payload:', {
      client_id: serverConfig.phonepe.clientId,
      grant_type: 'client_credentials',
      // Don't log the secret
    });

    const authUrl = `${process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL}/apis/merchant/authentication`;
    console.log('Auth URL:', authUrl);

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('Auth response status:', response.status);
    const data = await response.json();
    console.log('Auth response data:', data);

    if (!response.ok) {
      console.error('Authentication failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to get access token' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!data.token) {
      console.error('No token in response:', data);
      return NextResponse.json(
        { success: false, error: 'No access token received' },
        { status: 401, headers: corsHeaders }
      );
    }

    console.log('Authentication successful');
    return NextResponse.json(
      { 
        success: true, 
        token: data.token,
        expiresIn: data.expiresIn,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in auth route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to authenticate with PhonePe',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 