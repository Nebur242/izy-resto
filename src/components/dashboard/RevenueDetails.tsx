import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';
import { Order } from '../../types';
import { TrendingUp, DollarSign, ShoppingBag, Calendar } from 'lucide-react';

interface RevenueDetailsProps {
  orders: Order[];
  dateRange: { startDate: Date; endDate: Date };
}

export function RevenueDetails({ orders, dateRange }: RevenueDetailsProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = orders.length > 0 ? totalRevenue / orders.length : 0;
  const ordersCount = orders.length;

  // Calculate daily revenue only if we have valid dates
  const dailyRevenue = React.useMemo(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return 0;
    
    const days = Math.max(1, Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    ));
    return totalRevenue / days;
  }, [dateRange, totalRevenue]);

  const stats = [
    {
      label: t('dashboard.stats.totalRevenue'),
      value: formatCurrency(totalRevenue, settings?.currency),
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: t('dashboard.stats.avgOrderValue'),
      value: formatCurrency(averageOrder, settings?.currency),
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: t('dashboard.stats.ordersCount'),
      value: ordersCount.toString(),
      icon: ShoppingBag,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: t('dashboard.stats.dailyRevenue'),
      value: formatCurrency(dailyRevenue, settings?.currency),
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-opacity-20 ${stat.color.replace('text', 'bg')}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-xl font-semibold">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}