import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orders/order.service';
import toast from 'react-hot-toast';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  filteredOrders: (status?: OrderStatus) => Order[];
  deliveredOrders: Order[];
  pendingOrders: Order[];
  preparingOrders: Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrders(
      updatedOrders => {
        setOrders(updatedOrders);
        setIsLoading(false);
        setError(null);
      },
      error => {
        console.error('Error in orders subscription:', error);
        setError(error);
        setIsLoading(false);
        toast.error('Erreur de chargement des commandes');
      }
    );

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success('Statut mis à jour');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Échec de la mise à jour');
      throw error;
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const filteredOrders = (status?: OrderStatus) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  // Memoized filtered lists
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        updateOrderStatus,
        getOrderById,
        filteredOrders,
        deliveredOrders,
        pendingOrders,
        preparingOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
