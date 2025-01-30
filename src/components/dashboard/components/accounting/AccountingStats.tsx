import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { AccountingStats as AccountingStatsType } from '../../../../types/accounting';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';

interface AccountingStatsProps {
  stats: AccountingStatsType | null;
  isLoading: boolean;
}

export function AccountingStats({ stats, isLoading }: AccountingStatsProps) {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Revenus',
      value: formatCurrency(stats.totalRevenue, settings?.currency),
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Dépenses',
      value: formatCurrency(stats.totalExpenses, settings?.currency),
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Bénéfice Net',
      value: formatCurrency(stats.netIncome, settings?.currency),
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Commandes',
      value: stats.orderCount.toString(),
      icon: ShoppingBag,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-lg ${card.bgColor} p-3`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
