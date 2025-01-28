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
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
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