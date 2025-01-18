import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../../types';
import { formatFirestoreTimestamp } from '../../../utils/date';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    ready: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  };

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Order #{order.id.slice(0, 8)}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFirestoreTimestamp(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white">
              FCFA{order.total.toFixed(2)}
            </p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}