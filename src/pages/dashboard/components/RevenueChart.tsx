import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../../types';

interface RevenueChartProps {
  orders: Order[];
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      data[date] = (data[date] || 0) + order.total;
    });
    return Object.entries(data).slice(-7);
  }, [orders]);

  const maxRevenue = Math.max(...revenueData.map(([_, value]) => value));

  return (
    <div className="h-64">
      <div className="flex h-full items-end space-x-2">
        {revenueData.map(([date, revenue], index) => (
          <div key={date} className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(revenue / maxRevenue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
            />
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 rotate-45">
              {date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}