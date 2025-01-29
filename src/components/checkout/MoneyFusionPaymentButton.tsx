import { AnimatePresence, motion } from 'framer-motion';
import { FusionPay } from 'fusionpay';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CartItem } from '../../types';
import { Button } from '../ui/Button';

interface PaymentResponse {
  statut: boolean;
  token: string;
  message: string;
  url: string;
}

interface MoneyFusionModalProps {
  onClose: () => void;
  iframeUrl: string;
}

const MoneyFusionModal = ({ onClose, iframeUrl }: MoneyFusionModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden min-h-[600px]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <iframe src={iframeUrl} width="100%" height="100%" />
      </motion.div>
    </div>
  );
};

interface MoneyFusionPaymentButtonProps {
  total: number;
  cart: CartItem[];
  paymentMethod: {
    apiKey: string;
    url: string;
  };
  currency: string;
  customerData: {
    name?: string;
    phone?: string;
    email?: string;
  };
  onConfirm: () => void;
}

export const MoneyFusionPaymentButton = ({
  total,
  cart,
  paymentMethod,
  customerData,
  onConfirm,
}: MoneyFusionPaymentButtonProps) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentResponse | null>(null);
  const [isClosed, setIsClosed] = useState(true);

  const fusionPay = new FusionPay(paymentMethod.url);

  const handleClose = async () => {
    if (paymentResponse?.token) {
      try {
        const status = await fusionPay.checkPaymentStatus(
          paymentResponse.token
        );
        if (status.statut && status.data.statut === 'paid') {
          onConfirm();
        }
      } catch (error) {
        setPaymentError('Erreur lors de la vérification du paiement');
      }
    }
    setIsClosed(false);
  };

  const requestPayment = async () => {
    try {
      setIsPaying(true);
      setPaymentError(null);

      // Add cart items to FusionPay
      cart.forEach(item => {
        fusionPay.addArticle(item.name, item.price * item.quantity);
      });

      // Configure payment details
      fusionPay
        .totalPrice(total)
        .clientName(customerData.name || 'Client')
        .clientNumber(customerData.phone || '111111111')
        .addInfo({
          orderId: crypto.randomUUID(),
          customerEmail: customerData.email,
        })
        .returnUrl(`${window.location.origin}/payment/pending`);

      const response = await fusionPay.makePayment();

      if (
        !response?.statut &&
        (response as any)['message-money-fusion']?.response_text_fr
      ) {
        setPaymentError(
          (response as any)['message-money-fusion']?.response_text_fr
        );
        return;
      }

      setPaymentResponse(response);

      if (!response.statut) {
        throw new Error(response.message || 'Payment initiation failed');
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isClosed && paymentResponse?.url && (
            <MoneyFusionModal
              onClose={handleClose}
              iframeUrl={paymentResponse.url}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              {paymentError}
            </p>
          </div>
        </motion.div>
      )}

      <Button
        disabled={isPaying}
        onClick={paymentResponse ? () => setIsClosed(true) : requestPayment}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Payer avec MoneyFusion
      </Button>
    </>
  );
};
