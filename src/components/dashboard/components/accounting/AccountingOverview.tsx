import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { AccountingStats } from '../../../../types/accounting';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';

interface AccountingOverviewProps {
  stats: AccountingStats | null;
  isLoading: boolean;
}

export function AccountingOverview({
  stats,
  isLoading,
}: AccountingOverviewProps) {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        ))}
      </div>
    );
  }

  const overviewStats = [
    {
      label: 'Débit',
      amount: stats?.totalDebit || 0,
      icon: ArrowUpRight,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Crédit',
      amount: stats?.totalCredit || 0,
      icon: ArrowDownRight,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Montant Net',
      amount: stats?.netAmount || 0,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {overviewStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold">
                {formatCurrency(stat.amount, settings?.currency)}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
