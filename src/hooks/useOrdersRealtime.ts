import { useState, useEffect } from 'react';
import { orderService } from '../services/orders/order.service';
import { Order } from '../types';
import toast from 'react-hot-toast';

export function useOrdersRealtime() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = orderService.subscribeToOrders(
      (updatedOrders) => {
        // Update orders without animation
        setOrders(updatedOrders);
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error in orders subscription:', error);
        setError(error);
        setIsLoading(false);
        toast.error('Erreur de chargement des commandes');
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return { 
    orders, 
    isLoading,
    error,
    isError: !!error
  };
}