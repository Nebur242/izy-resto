import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IOrderStatsProps {
  stats: {
    total: number;
    pending: number;
    preparing: number;
    delivered: number;
  };
}

export function OrderStats(props: IOrderStatsProps) {
  const { t } = useTranslation('order');
  const { stats } = props;
  const statCards = [
    {
      title: t('common:total-orders'),
      value: stats.total,
      icon: ShoppingBag,
      color: 'blue',
    },
    {
      title: t('common:pending'),
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: t('common:in-cooking'),
      value: stats.preparing,
      icon: AlertCircle,
      color: 'purple',
    },
    {
      title: t('common:delivered'),
      value: stats.delivered,
      icon: CheckCircle,
      color: 'green',
    },
  ];

  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    yellow:
      'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
    purple:
      'bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    green:
      'bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colors[stat.color]}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
