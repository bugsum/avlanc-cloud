# PhonePe Payment Gateway Integration

This guide explains how to set up and use the PhonePe payment gateway in the Avlanc Cloud website.

## Prerequisites

1. A PhonePe merchant account
2. API credentials from PhonePe (Merchant ID, API Key, and Salt Key)
3. Node.js and npm installed

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root of your project and add the following variables:
   ```
   # PhonePe Credentials
   PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID
   PHONEPE_API_KEY=YOUR_API_KEY
   PHONEPE_SALT_KEY=YOUR_SALT_KEY
   PHONEPE_SALT_INDEX=YOUR_SALT_INDEX
   
   # Application URL (for callbacks)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   Replace the placeholder values with your actual PhonePe credentials.

## Testing

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Test Transactions**
   - Use test card numbers provided by PhonePe for testing
   - Test both successful and failed payment scenarios

## Available Routes

- `/checkout` - Checkout page with payment form
- `/payment/success` - Success page after successful payment
- `/payment/failed` - Page shown when payment fails

## API Endpoints

- `POST /api/payment` - Initiate PhonePe payment
- `GET /api/payment/callback` - Handle PhonePe payment callback

## Notes

- Ensure your server is accessible via HTTPS in production
- Keep your API keys secure and never commit them to version control
- Monitor transactions in your PhonePe merchant dashboard

## Support

For any issues or questions, please contact support@avlanc.cloud
