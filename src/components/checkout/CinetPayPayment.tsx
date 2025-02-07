import { useRef, useState } from 'react';
import { Button } from '../ui';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { RestaurantSettings } from '../../types';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CinetPayPaymentModal = ({
  onClose,
  iframeUrl,
}: {
  onClose: () => void;
  iframeUrl?: string;
}) => {
  const mutationRef = useRef(null);

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
        className="relative w-full max-w-2xl aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden min-h-[600px]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {iframeUrl && (
          <iframe
            ref={mutationRef}
            src={iframeUrl}
            width={`100%`}
            height={'100%'}
          ></iframe>
        )}
      </motion.div>
    </div>
  );
};

export const CinetPayPayment = ({
  paymentMethod: { apiKey, apiSecret },
  settings,
  amount,
  onConfirm,
}: {
  paymentMethod: {
    apiKey: string;
    apiSecret: string;
  };
  settings: RestaurantSettings;
  amount: number;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation('common');
  const [isClosed, setIsClosed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleClose = async () => {
    onConfirm();
    setIsClosed(true);
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setError('');
      const commandRef = uuidv4();

      const data = {
        amount,
        currency: settings.currency,
        apikey: apiKey,
        site_id: apiSecret,
        transaction_id: commandRef,
        description: 'TRANSACTION DESCRIPTION',
        return_url: `${window.location.origin}/paytech/success`,
        notify_url:
          'https://restaurants-project-backend-solitary-brook-2574.fly.dev/api/v1/payments/notify',
        metadata: commandRef,
        customer_id: commandRef,
        customer_name: `User ${commandRef}`,
        customer_surname: `Surname ${commandRef}`,
        channels: 'MOBILE_MONEY',
      };

      const response = await axios.post<{
        data: {
          payment_token: string;
          payment_url: string;
        };
        message: string;
        code: string;
      }>(`https://api-checkout.cinetpay.com/v2/payment`, data);

      setUrl(response.data.data.payment_url);
      setIsClosed(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data.description || 'Une erreur est survenue...'
        );
      }
      toast.error('Erreur de paiement...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isClosed && (
          <CinetPayPaymentModal iframeUrl={url} onClose={handleClose} />
        )}
      </AnimatePresence>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      <Button
        disabled={isLoading}
        onClick={handleClick}
        className="w-full"
        type="submit"
      >
        {isLoading ? t('loading-in-progress') : t('pay-with-cinetpay')}
      </Button>
    </>
  );
};
