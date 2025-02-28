import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '../../types';
import { OrderCard } from './OrderCard';
import { Pagination } from '../ui/Pagination';
import { useTranslation } from 'react-i18next';

interface IOrderListProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onCancel?: (orderId: string) => void;
}

const ITEMS_PER_PAGE = 8;

export function OrderList(props: IOrderListProps) {
  const { orders, onStatusChange, onCancel } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation('order');

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {paginatedOrders.map(order => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                layout: { duration: 0.3 },
                opacity: { duration: 0.2 },
              }}
            >
              <OrderCard
                order={order}
                onStatusChange={onStatusChange}
                onCancel={onCancel}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
          >
            <p className="text-lg">{t('no-order-found')}</p>
          </motion.div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
