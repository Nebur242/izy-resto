import { useState, useMemo } from 'react';
import { OrderList } from '../../../components/orders/OrderList';
import { OrderStats } from '../../../components/orders/OrderStats';
import { OrderFilters } from '../../../components/orders/OrderFilters';
import { OrderStatus } from '../../../types';
import { useOrders } from '../../../context/OrderContext';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export function OrderManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [cancelConfirmation, setCancelConfirmation] = useState<{
    isOpen: boolean;
    orderId?: string;
  }>({ isOpen: false });

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false;
        }

        // Date range filter
        if (dateRange.from || dateRange.to) {
          const orderDate = new Date(order.createdAt.seconds * 1000);
          if (dateRange.from && orderDate < dateRange.from) {
            return false;
          }
          if (dateRange.to && orderDate > dateRange.to) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [orders, statusFilter, dateRange]);

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: filteredOrders.length,
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      preparing: filteredOrders.filter(o => o.status === 'preparing').length,
      delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    }),
    [filteredOrders]
  );

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelConfirmation.orderId) return;

    try {
      await updateOrderStatus(cancelConfirmation.orderId, 'cancelled');
      setCancelConfirmation({ isOpen: false });
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="space-y-6">
      <OrderStats stats={stats} />

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <OrderFilters
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <OrderList
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
        onCancel={orderId =>
          setCancelConfirmation({
            isOpen: true,
            orderId,
          })
        }
      />

      <ConfirmDialog
        isOpen={cancelConfirmation.isOpen}
        title="Annuler la commande"
        message="Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible."
        confirmLabel="Annuler la commande"
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelConfirmation({ isOpen: false })}
      />
    </div>
  );
}
