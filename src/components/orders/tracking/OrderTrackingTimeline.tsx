import { motion } from 'framer-motion';
import { Order } from '../../../types';
import { OrderTimeline } from '../OrderTimeline';
import { OrderQRCode } from '../OrderQRCode';
import { Button } from '../../ui';
import { useState } from 'react';
import { generateReceiptPDF } from '../../../utils/pdf';
import { useSettings } from '../../../hooks';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

interface OrderTrackingTimelineProps {
  order: Order;
}

export function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { settings } = useSettings();

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);
      const pdf = await generateReceiptPDF(order, settings);
      pdf.save(`commande-${order.id.slice(0, 8)}.pdf`);
      toast.success('Facture téléchargée');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">État de la commande</h2>

      <div className="space-y-6">
        <OrderTimeline
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
              variant="secondary"
              onClick={handleDownloadReceipt}
              disabled={isDownloading || order.status === 'pending'}
              className="w-full mt-4"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Téléchargement...' : 'Télécharger'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
