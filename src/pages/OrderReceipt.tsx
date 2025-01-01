import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Star, Share2, QrCode, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useOrders } from '../context/OrderContext';
import { useSettings } from '../hooks/useSettings';
import { OrderReceiptHeader } from '../components/orders/receipt/OrderReceiptHeader';
import { OrderReceiptDetails } from '../components/orders/receipt/OrderReceiptDetails';
import { OrderTrackingLink } from '../components/orders/receipt/OrderTrackingLink';
import { OrderQRCode } from '../components/orders/OrderQRCode';
import { generateReceiptPDF } from '../utils/pdf';
import { orderService } from '../services/orders/order.service';
import toast from 'react-hot-toast';

export function OrderReceipt() {
  const location = useLocation();
  const { updateOrderStatus } = useOrders();
  const { settings } = useSettings();
  const [order, setOrder] = React.useState(location.state?.order);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Subscribe to real-time order updates
  React.useEffect(() => {
    if (!order?.id) return;

    const unsubscribe = orderService.subscribeToOrder(order.id, (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => unsubscribe();
  }, [order?.id]);

  // If no order in state, redirect to home
  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);
      await generateReceiptPDF(order, settings);
      toast.success('Facture téléchargée');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Commande #${order.id.slice(0, 8)}`,
          text: `Suivez ma commande sur ${settings?.name || 'notre restaurant'}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié !');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (order.status !== 'pending') {
      toast.error('Cette commande ne peut plus être annulée');
      return;
    }

    try {
      await updateOrderStatus(order.id, 'cancelled');
      toast.success('Commande annulée avec succès');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>

        {/* Main Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Status Header */}
          <div className={`p-6 text-white ${
            order.status === 'cancelled'
              ? 'bg-red-600'
              : 'bg-gradient-to-r from-emerald-500 to-green-600'
          }`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                {order.status === 'cancelled' ? (
                  <XCircle className="w-8 h-8" />
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {order.status === 'cancelled' ? 'Commande annulée' : 'Commande confirmée !'}
                </h1>
                <p className="text-white/80">
                  {order.status === 'cancelled'
                    ? 'Cette commande a été annulée'
                    : 'Votre commande a été enregistrée avec succès'}
                </p>
              </div>
            </div>
          </div>

          <OrderReceiptDetails order={order} />

          {/* Actions */}
          <div className="p-6 border-t dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                onClick={handleDownloadReceipt}
                disabled={isDownloading}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Téléchargement...' : 'Télécharger'}
              </Button>

              <Button
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>

            {/* QR Code Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowQR(!showQR)}
              className="w-full mt-4"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? 'Masquer le QR Code' : 'Afficher le QR Code'}
            </Button>

            {/* QR Code Section */}
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

            {/* Cancel Button - Only show if pending */}
            {order.status === 'pending' && (
              <Button
                variant="danger"
                onClick={handleCancelOrder}
                className="w-full mt-4"
              >
                Annuler la commande
              </Button>
            )}
          </div>
        </motion.div>

        {/* Rating Prompt */}
        {(order.status === 'delivered' || order.status === 'cancelled') && !order.rating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg"
          >
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold mb-2">
              Votre avis compte !
            </h3>
            <p className="text-white/80 mb-4">
              Aidez-nous à améliorer notre service en notant votre commande
            </p>
            <Link to={`/order/${order.id}`}>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Noter ma commande
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Tracking Link */}
        {order.status !== 'cancelled' && (
          <OrderTrackingLink orderId={order.id} />
        )}
      </div>
    </div>
  );
}