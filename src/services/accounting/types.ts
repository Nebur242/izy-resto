import { Transaction } from '../../types/accounting';

export interface AccountingServiceError extends Error {
  code: string;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'debit' | 'credit';
}

export type TransactionInput = Omit<Transaction, 'id' | 'gross'>;