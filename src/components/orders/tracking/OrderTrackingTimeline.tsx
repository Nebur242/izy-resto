import { motion } from 'framer-motion';
import { Order } from '../../../types';
import { OrderTimeline } from '../OrderTimeline';
import { OrderQRCode } from '../OrderQRCode';
import { Button } from '../../ui';
import { useState } from 'react';
import { generateUserReceipt } from '../../../utils/pdf';
import { useSettings } from '../../../hooks';
import toast from 'react-hot-toast';
import { Download, Clipboard } from 'lucide-react';
import { useOrders } from '../../../context/OrderContext';

interface OrderTrackingTimelineProps {
  order: Order;
}

export function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { settings } = useSettings();
  const { updateOrderStatus } = useOrders();

  const handleCancelOrder = async () => {
    if (order.status !== 'pending') {
      toast.error('Cette commande ne peut plus être annulée');
      return;
    }

    try {
      setIsCancelling(true);
      await updateOrderStatus(order.id, 'cancelled');
      toast.success('Commande annulée avec succès');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error("Erreur lors de l'annulation");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);
      const pdf = await generateUserReceipt(order, settings);
      pdf.save(`commande-${order.id.slice(0, 8)}.pdf`);
      toast.success('Facture téléchargée');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${window.location.origin}/order/${order.id}`
      );
      toast.success('Lien copié 👌');
    } else {
      window.open(`${window.location.origin}/order/${order.id}`, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">État de la commande</h2>

      <div className="space-y-6">
        <OrderTimeline
          order={order}
          status={order.status}
          createdAt={order.createdAt}
          updatedAt={order.updatedAt}
        />

        {order.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pt-6 border-t dark:border-gray-700"
          >
            <OrderQRCode orderId={order.id} size={150} />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Scannez ce code pour suivre votre commande
            </p>
            <Button
              variant="primary"
              onClick={handleCopyLink}
              className="w-full mt-4"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Cliquer pour copier
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadReceipt}
              disabled={isDownloading || order.status === 'pending'}
              className="w-full mt-4"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading
                ? 'Téléchargement...'
                : 'Télécharger la confirmation de commande'}
            </Button>
            {/* Cancel Button - Only show if pending */}
            {order.status === 'pending' && (
              <Button
                disabled={isCancelling}
                variant="danger"
                onClick={handleCancelOrder}
                className="w-full mt-4"
              >
                Annuler la commande
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
