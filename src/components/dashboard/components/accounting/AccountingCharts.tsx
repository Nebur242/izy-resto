import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AccountingPeriod, RevenueByCategory, ExpensesByCategory } from '../../../../types/accounting';
import { accountingService } from '../../../../services/accounting/accounting.service';
import { useOrdersRealtime } from '../../../../hooks/useOrdersRealtime';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';

interface AccountingChartsProps {
  period: AccountingPeriod;
  isLoading: boolean;
}

export function AccountingCharts({ period, isLoading }: AccountingChartsProps) {
  const { orders } = useOrdersRealtime();
  const { settings } = useSettings();
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategory[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpensesByCategory[]>([]);

  useEffect(() => {
    loadChartData();
  }, [period, orders]);

  const loadChartData = async () => {
    try {
      const [revenue, expenses] = await Promise.all([
        accountingService.getRevenueByCategory(period, orders),
        accountingService.getExpensesByCategory(period)
      ]);
      setRevenueByCategory(revenue);
      setExpensesByCategory(expenses);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h3 className="mb-6 text-lg font-semibold">Revenus par Catégorie</h3>
        <div className="space-y-4">
          {revenueByCategory.map((category) => (
            <div key={category.categoryId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{category.categoryName}</span>
                <span className="font-medium">
                  {formatCurrency(category.amount, settings?.currency)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Expenses by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h3 className="mb-6 text-lg font-semibold">Dépenses par Catégorie</h3>
        <div className="space-y-4">
          {expensesByCategory.map((category) => (
            <div key={category.categoryId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{category.categoryName}</span>
                <span className="font-medium">
                  {formatCurrency(category.amount, settings?.currency)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}