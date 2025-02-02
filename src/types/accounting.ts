export interface Transaction {
  id: string;
  date: string;
  source: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  gross: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountingStats {
  totalDebit: number;
  totalCredit: number;
  netAmount: number;
  transactionCount: number;
}

export interface AccountingPeriod {
  startDate: Date;
  endDate: Date;
}
