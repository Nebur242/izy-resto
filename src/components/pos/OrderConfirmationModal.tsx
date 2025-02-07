import { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Order } from '../../types';
import { generateReceiptPDF } from '../../utils/pdf';
import { useSettings } from '../../hooks/useSettings';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface IOrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderConfirmationModal(props: IOrderConfirmationModalProps) {
  const { order, onClose } = props;
  const { t } = useTranslation('order');
  const { settings } = useSettings();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const { t } = useTranslation('ticket');

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const pdf = await generateReceiptPDF(order, t, settings);
      pdf.save(`commande-${order.id.slice(0, 8)}.pdf`);
      toast.success('Ticket téléchargé');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const pdf = await generateReceiptPDF(order, t, settings);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">{t("order-confimed")}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            La commande #{order.id.slice(0, 8)} a été enregistrée avec succès.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="w-full flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 mr-1" />
            {isPrinting ? 'Impression...' : 'Imprimer le ticket'}
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 mr-1" />
            {isDownloading ? 'Téléchargement...' : 'Télécharger le ticket'}
          </Button>

          <Button variant="ghost" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
