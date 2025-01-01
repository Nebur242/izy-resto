import { Transaction } from '../types/accounting';

export function validateTransaction(transaction: Partial<Transaction>): boolean {
  const debit = Number(transaction.debit || 0);
  const credit = Number(transaction.credit || 0);
  
  return !isNaN(debit) && !isNaN(credit) && 
         isFinite(debit) && isFinite(credit) &&
         debit >= 0 && credit >= 0;
}

export function calculateGross(debit: number, credit: number): number {
  return Number(credit) - Number(debit);
}

export function formatTransactionAmount(amount: number | string | null | undefined): number {
  if (amount === null || amount === undefined || amount === '') {
    return 0;
  }
  const num = Number(amount);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}