import { Currency } from '../types';

export function formatCurrency(amount: number | string | null | undefined, currency?: Currency): string {
  // Handle null/undefined
  if (amount === null || amount === undefined) {
    return '0';
  }

  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Validate the amount is a number
  if (isNaN(numericAmount)) {
    console.error('Invalid amount provided to formatCurrency:', amount);
    return '0';
  }

  switch (currency) {
    case 'EUR':
      return `€${numericAmount.toFixed(2)}`;
    case 'XOF':
      return `${Math.round(numericAmount).toLocaleString()} FCFA`;
    default:
      return `$${numericAmount.toFixed(2)}`;
  }
}

export function getCurrencyStep(currency?: Currency): string {
  return currency === 'XOF' ? '1' : '0.01';
}

export function getQuickAmounts(currency?: Currency): number[] {
  switch (currency) {
    case 'XOF':
      return [5000, 10000, 20000, 30000];
    case 'EUR':
      return [10, 20, 50, 100];
    default:
      return [10, 20, 50, 100];
  }
}