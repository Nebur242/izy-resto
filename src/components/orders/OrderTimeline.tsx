import { motion } from 'framer-motion';
import { Order, OrderStatus } from '../../types';
import { formatFirestoreTimestamp } from '../../utils/date';

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  order: Order;
}

export function OrderTimeline({
  status,
  createdAt,
  updatedAt,
  order,
}: OrderTimelineProps) {
  const statuses: OrderStatus[] = ['pending', 'preparing', 'delivered'];
  const currentIndex = statuses.indexOf(status);

  // Mapping of order statuses to French labels
  const statusLabels: { [key in OrderStatus]: string } = {
    pending: 'En attente',
    preparing: 'En préparation',
    delivered: 'Livraison',
    cancelled: 'Annulé',
  };

  const getStatusLabel = (
    status: Order['status'],
    diningOption: Order['diningOption']
  ) => {
    if (status === 'delivered' && diningOption === 'dine-in') {
      return 'A la table';
    }
    return statusLabels[status];
  };

  return (
    <div className="mt-4">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-2.5 h-0.5 w-full bg-gray-200 dark:bg-gray-700" />

        {/* Status Indicators */}
        <div className="relative flex justify-between">
          {statuses.map((s, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;

            return (
              <div key={s} className="flex flex-col items-center w-1/3">
                {/* Status Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted ? '#3B82F6' : '#E5E7EB',
                  }}
                  className={`w-5 h-5 rounded-full relative z-10 ${
                    isActive ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''
                  }`}
                />

                {/* Status Label */}
                <span className="mt-2 text-sm text-center">
                  {getStatusLabel(s, order.diningOption)}
                </span>

                {/* Timestamp */}
                {index === 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {formatFirestoreTimestamp(createdAt)}
                  </span>
                )}
                {isActive && index > 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {formatFirestoreTimestamp(updatedAt)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
