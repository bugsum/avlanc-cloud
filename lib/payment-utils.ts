import { PaymentStatus } from './phonepe';

/**
 * Format amount from paise to rupees
 * @param amountInPaise Amount in paise
 * @returns Formatted amount in rupees with 2 decimal places
 */
export const formatAmount = (amountInPaise: number): string => {
  return (amountInPaise / 100).toFixed(2);
};

/**
 * Format date from timestamp
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get payment status badge color based on status
 * @param status Payment status
 * @returns Tailwind CSS color class
 */
export const getStatusBadgeColor = (status: PaymentStatus['state']): string => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get payment status display text
 * @param status Payment status
 * @returns Human-readable status text
 */
export const getStatusText = (status: PaymentStatus['state']): string => {
  switch (status) {
    case 'COMPLETED':
      return 'Completed';
    case 'FAILED':
      return 'Failed';
    case 'PENDING':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

/**
 * Validate if a string is a valid URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract transaction ID from URL
 * @param url URL containing transaction ID
 * @returns Transaction ID or null if not found
 */
export const extractTransactionId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('transactionId');
  } catch {
    return null;
  }
};

/**
 * Format currency with Indian numbering system
 * @param amount Amount in paise
 * @returns Formatted currency string (e.g., "₹1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};
