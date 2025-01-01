import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnalyticCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export function AnalyticCard({ title, value, icon: Icon, color }: AnalyticCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}