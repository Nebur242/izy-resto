import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../types';
import { OrderCardHeader } from './card/OrderCardHeader';
import { OrderCardDetails } from './card/OrderCardDetails';
import { OrderTimeline } from './OrderTimeline';
import { Button } from '../ui/Button';
import { Printer } from 'lucide-react';
import { generateReceiptPDF } from '../../utils/pdf';
import { useSettings } from '../../hooks';
import toast from 'react-hot-toast';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
  onCancel?: (orderId: string) => void;
}

export const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
  ({ order, onStatusChange, onCancel }, ref) => {
    const { settings } = useSettings();

    const canCancel = ['pending', 'preparing'].includes(order.status);
    const [isPrinting, setIsPrinting] = useState(false);

    const statusStyles = {
      pending:
        'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300', // Warm yellow for new order
      preparing:
        'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300', // Fresh blue for in kitchen
      ready:
        'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300', // Hot orange for ready to serve
      delivered:
        'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300', // Cool teal for completed
      cancelled: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300', // Standard red for cancelled
    };

    const handlePrint = async () => {
      try {
        setIsPrinting(true);
        const pdf = await generateReceiptPDF(order, settings);
        pdf.autoPrint();
        window.open(pdf.output('bloburl'));
        toast.success("Ticket envoyé à l'impression");
      } catch (error) {
        console.error('Error printing receipt:', error);
        toast.error("Erreur lors de l'impression");
      } finally {
        setIsPrinting(false);
      }
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`rounded-lg shadow-sm p-6 ${statusStyles[order.status]} ${
          order.status === 'cancelled' ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        <div className="space-y-6">
          {/* Header with order info */}
          <OrderCardHeader order={order} />

          {/* Order Timeline */}
          <OrderTimeline
            order={order}
            status={order.status}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />

          {/* Order Details */}
          <OrderCardDetails order={order} />

          {/* Actions */}
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-current/10">
            {/* Status Change Button */}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <Button
                onClick={() =>
                  onStatusChange(
                    order.id,
                    order.status === 'pending' ? 'preparing' : 'delivered'
                  )
                }
                className="flex-1 bg-white/90 hover:bg-white text-current"
              >
                {order.status === 'pending'
                  ? 'Marquer en préparation'
                  : 'Marquer comme livré'}
              </Button>
            )}

            {/* Cancel Button */}
            {canCancel && onCancel && (
              <Button
                variant="danger"
                onClick={() => onCancel(order.id)}
                className="flex-1"
              >
                Annuler la commande
              </Button>
            )}
          </div>
          <Button
            onClick={handlePrint}
            disabled={isPrinting || order.status !== 'delivered'}
            className="bg-white/90 hover:bg-white text-current px-4 py-2 rounded w-full"
          >
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? 'Impression...' : 'Imprimer le ticket'}
          </Button>
        </div>
      </motion.div>
    );
  }
);

OrderCard.displayName = 'OrderCard';
