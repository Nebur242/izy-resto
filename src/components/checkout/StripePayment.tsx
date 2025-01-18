import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { useState, useEffect } from 'react';
import { AlertCircle, X, CreditCard, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from '@stripe/react-stripe-js';
import { processPayment } from '../../services/payments/stripe.service';
import { AxiosError } from 'axios';

const useCardElementStyle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    // Create observer for dark mode changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return {
    style: {
      base: {
        fontSize: '16px',
        color: isDarkMode ? '#ffffff' : '#000000',
        '::placeholder': {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
        },
        iconColor: isDarkMode ? '#ffffff' : '#000000',
      },
    },
  };
};

const PaymentModal = ({
  onClose,
  amount,
  currency,
  onConfirm,
  apiSecret,
}: {
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  currency: string;
  apiSecret: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cardElementStyle = useCardElementStyle();

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      setLoading(true);

      if (!elements) {
        throw new Error('elements not exist');
      }

      const card = elements.getElement(CardElement);

      if (!card) throw new Error('card not exists');

      if (!stripe) {
        throw new Error('Stripe not exist');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });

      if (error) {
        throw new Error(error.message || 'Error');
      }

      const result: any = await processPayment({
        amount,
        currency,
        apiSecret,
        paymentMethodId: paymentMethod.id,
        return_url: window.location.href,
      });

      if (!result) {
        throw new Error('Error');
      }

      if (result.success) {
        onClose();
        onConfirm();
        return;
      }

      if (result.requiresAction) {
        const { error } = await stripe.confirmCardPayment(
          result.paymentIntentClientSecret
        );

        if (error) {
          console.error('Payment Confirmation Error:', error.message);
          setErrorMessage(
            error.message || 'Une erreur de paiement est survenue'
          );
          throw new Error('Error');
        } else {
          onClose();
          onConfirm();
          return;
        }
      }

      throw new Error('Error');
    } catch (error: any) {
      console.log(error);

      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.message || 'Erreur de paiement...'
        );
        return;
      }

      setErrorMessage(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Paiement sécurisé</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-white/90">
            Montant à payer: {formattedAmount}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Informations de carte
                </span>
              </div>
              <CardElement options={cardElementStyle} />
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">
                    {errorMessage}
                  </p>
                </div>
              </motion.div>
            )}

            <div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5"
                type="submit"
                disabled={!stripe || !elements || loading}
              >
                {loading ? (
                  'Traitement en cours...'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Payer {formattedAmount}
                  </span>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Paiement sécurisé via Stripe
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const StripePayment = ({
  amount,
  currency,
  onConfirm,
  apiKey,
  apiSecret,
}: {
  amount: number;
  currency: string;
  apiSecret: string;
  apiKey: string;
  onConfirm: () => void;
}) => {
  const [isClosed, setIsClosed] = useState(true);

  const handleClose = () => {
    setIsClosed(true);
  };

  const stripePromise = loadStripe(apiKey);

  return (
    <>
      <AnimatePresence>
        {!isClosed && (
          <Elements
            stripe={stripePromise}
            options={{
              mode: 'payment',
              amount: Math.round(amount * 100),
              currency,
            }}
          >
            <PaymentModal
              apiSecret={apiSecret}
              amount={amount}
              currency={currency}
              onClose={handleClose}
              onConfirm={onConfirm}
            />
          </Elements>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsClosed(false)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5"
      >
        <span className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payer avec Stripe
        </span>
      </Button>
    </>
  );
};

export default StripePayment;
