import { useState, useEffect, useMemo } from 'react';
import { Transaction, AccountingStats, AccountingPeriod } from '../types/accounting';
import { accountingService } from '../services/accounting/accounting.service';
import toast from 'react-hot-toast';

export function useAccounting(period: AccountingPeriod) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats from transactions with proper type handling and validation
  const stats = useMemo<AccountingStats>(() => {
    const validTransactions = transactions.filter(t => 
      // Ensure we only process transactions with valid numbers
      (typeof t.debit === 'number' || typeof t.credit === 'number') &&
      !isNaN(t.debit || 0) && !isNaN(t.credit || 0)
    );

    const totalDebit = validTransactions.reduce((sum, t) => {
      const debitAmount = typeof t.debit === 'number' ? Math.abs(t.debit) : 0;
      return sum + debitAmount;
    }, 0);

    const totalCredit = validTransactions.reduce((sum, t) => {
      const creditAmount = typeof t.credit === 'number' ? Math.abs(t.credit) : 0;
      return sum + creditAmount;
    }, 0);

    // Round to 2 decimal places to avoid floating-point precision issues
    const roundedDebit = Math.round(totalDebit * 100) / 100;
    const roundedCredit = Math.round(totalCredit * 100) / 100;
    const netAmount = Math.round((roundedCredit - roundedDebit) * 100) / 100;

    return {
      totalDebit: roundedDebit,
      totalCredit: roundedCredit,
      netAmount,
      transactionCount: validTransactions.length,
      // Add validation info for debugging
      invalidTransactions: transactions.length - validTransactions.length
    };
  }, [transactions]);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const fetchedTransactions = await accountingService.getTransactions(period);
      
      // Validate and clean transactions before setting
      const cleanedTransactions = fetchedTransactions.map(t => ({
        ...t,
        debit: typeof t.debit === 'number' ? t.debit : 0,
        credit: typeof t.credit === 'number' ? t.credit : 0
      }));

      setTransactions(cleanedTransactions);

      // Log validation info
      const invalidCount = fetchedTransactions.filter(t => 
        (typeof t.debit !== 'number' && t.debit !== null) || 
        (typeof t.credit !== 'number' && t.credit !== null) ||
        isNaN(t.debit || 0) || 
        isNaN(t.credit || 0)
      ).length;

      if (invalidCount > 0) {
        console.warn(`Found ${invalidCount} transactions with invalid debit/credit values`);
      }

    } catch (error) {
      console.error('Error loading accounting data:', error);
      toast.error('Erreur lors du chargement des données comptables');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    stats,
    isLoading,
    refreshData: loadData
  };
}