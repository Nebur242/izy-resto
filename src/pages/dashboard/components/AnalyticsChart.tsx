import React from 'react';
import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  data: Record<string, number>;
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const colors = {
    pending: 'bg-yellow-500',
    preparing: 'bg-blue-500',
    ready: 'bg-green-500',
    delivered: 'bg-purple-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="capitalize">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / total) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full ${colors[key as keyof typeof colors]}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}