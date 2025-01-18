import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderStatsProps {
  stats: {
    total: number;
    pending: number;
    preparing: number;
    delivered: number;
  };
}

export function OrderStats({ stats }: OrderStatsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <StatCard
        title="Totaux Commandes"
        value={stats.total}
        icon={Clock}
        color="blue"
        variants={item}
      />
      <StatCard
        title="En Attente"
        value={stats.pending}
        icon={AlertCircle}
        color="yellow"
        variants={item}
      />
      <StatCard
        title="En Preparation"
        value={stats.preparing}
        icon={Clock}
        color="purple"
        variants={item}
      />
      <StatCard
        title="Livraison"
        value={stats.delivered}
        icon={CheckCircle}
        color="green"
        variants={item}
      />
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'yellow' | 'purple' | 'green';
  variants?: any;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  variants,
}: StatCardProps) {
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
    <motion.div
      variants={variants}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-2xl font-semibold text-gray-900 dark:text-white"
          >
            {value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
