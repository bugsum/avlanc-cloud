export const config = {
  phonepe: {
    merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
    saltKey: process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY || '',
    saltIndex: parseInt(process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX || '1', 10),
    apiBaseUrl: process.env.NEXT_PUBLIC_PHONEPE_API_BASE_URL || 'https://api.phonepe.com',
    redirectUrl: process.env.NEXT_PUBLIC_PHONEPE_REDIRECT_URL || '',
    callbackUrl: process.env.NEXT_PUBLIC_PHONEPE_CALLBACK_URL || '',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || '',
  },
} as const;

// Validate required configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_PHONEPE_MERCHANT_ID',
  'NEXT_PUBLIC_PHONEPE_SALT_KEY',
  'NEXT_PUBLIC_PHONEPE_REDIRECT_URL',
  'NEXT_PUBLIC_PHONEPE_CALLBACK_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
} 