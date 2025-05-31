import { PhonePeConfig } from './phonepe/types';

// Public config (safe to expose to browser)
export const publicConfig = {
  phonepe: {
    merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
    apiBaseUrl: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL || 'https://api-preprod.phonepe.com',
    redirectUrl: process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL || '',
    callbackUrl: process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL || '',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || '',
  },
} as const;

// Server-side config (not exposed to browser)
export const serverConfig = {
  phonepe: {
    clientId: process.env.PHONEPE_CLIENT_ID || '',
    clientSecret: process.env.PHONEPE_CLIENT_SECRET || '',
    saltKey: process.env.PHONEPE_SALT_KEY || '',
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1', 10),
  },
} as const;

// Combined config for server-side use
export const phonePeConfig: PhonePeConfig = {
  ...publicConfig.phonepe,
  ...serverConfig.phonepe,
};

// Validate required configuration
const requiredPublicEnvVars = [
  'NEXT_PUBLIC_PHONEPE_MERCHANT_ID',
  'NEXT_PUBLIC_PHONEPE_REDIRECT_URL',
  'NEXT_PUBLIC_PHONEPE_CALLBACK_URL',
];

const requiredPrivateEnvVars = [
  'PHONEPE_CLIENT_ID',
  'PHONEPE_CLIENT_SECRET',
  'PHONEPE_SALT_KEY',
];

// Only validate private env vars on the server side
if (typeof window === 'undefined') {
  for (const envVar of requiredPrivateEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing required server environment variable: ${envVar}`);
    }
  }
}

// Always validate public env vars
for (const envVar of requiredPublicEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required public environment variable: ${envVar}`);
  }
} 