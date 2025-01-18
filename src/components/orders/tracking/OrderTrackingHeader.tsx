import React from 'react';
import { Order } from '../../../types';
import { useSettings } from '../../../hooks/useSettings';
import { formatCurrency } from '../../../utils/currency';
import { formatFirestoreTimestamp } from '../../../utils/date';

interface OrderTrackingHeaderProps {
  order: Order;
}

export function OrderTrackingHeader({ order }: OrderTrackingHeaderProps) {
  const { settings } = useSettings();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Commande #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {formatFirestoreTimestamp(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(order.total, settings?.currency)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {order.items.length} articles
          </p>
        </div>
      </div>
    </div>
  );
}