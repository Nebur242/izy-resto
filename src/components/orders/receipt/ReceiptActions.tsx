import { Download, Share2, QrCode } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Order } from '../../../types';
import { OrderQRCode } from '../OrderQRCode';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptActionsProps {
  order: Order;
  isDownloading: boolean;
  showQR: boolean;
  onDownload: () => Promise<void>;
  onShare: () => Promise<void>;
  onToggleQR: () => void;
  onCancel?: () => Promise<void>;
}

export function ReceiptActions({
  order,
  isDownloading,
  showQR,
  onDownload,
  onShare,
  onToggleQR,
  onCancel
}: ReceiptActionsProps) {
  return (
    <div className="p-6 border-t dark:border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Téléchargement...' : 'Télécharger'}
        </Button>

        <Button onClick={onShare} className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={onToggleQR}
        className="w-full mt-4"
      >
        <QrCode className="w-4 h-4 mr-2" />
        {showQR ? 'Masquer le QR Code' : 'Afficher le QR Code'}
      </Button>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-col items-center"
          >
            <OrderQRCode orderId={order.id} size={200} />
            <p className="mt-2 text-sm text-gray-500">
              Scannez pour suivre votre commande
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {order.status === 'pending' && onCancel && (
        <Button
          variant="danger"
          onClick={onCancel}
          className="w-full mt-4"
        >
          Annuler la commande
        </Button>
      )}
    </div>
  );
}