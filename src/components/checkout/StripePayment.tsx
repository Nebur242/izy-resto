import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { useState } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from '@stripe/react-stripe-js';
import { processPayment } from '../../services/payments/stripe.service';

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

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      setLoading(true);

      if (!elements) {
        throw new Error('elements not exist');
      }

      const card = elements.getElement(CardElement);

      if (!card) throw new Error('card not extists');

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
            error.message || 'Une erreur de paiemeent est survenu'
          );
          throw new Error('Error');
        } else {
          console.log('Payment Successful!');
          onClose();
          onConfirm();
          return;
        }
      }

      throw new Error('Error');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        className="relative w-full max-w-2xl aspect-square bg-white  rounded-2xl overflow-hidden min-h-[400px] p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="mt-10">
          <CardElement />
          <Button
            className="w-full mt-4"
            type="submit"
            disabled={!stripe || !elements}
          >
            {loading ? 'Paiement en cours...' : 'Payer maintenant'}
          </Button>
          {/* Show error message to your customers */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-medium text-red-800 dark:text-red-400">
                  {errorMessage}
                </h3>
              </div>
            </motion.div>
          )}
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
              amount,
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
        className={`
        bg-gradient-to-r from-blue-600 to-indigo-600
        hover:from-blue-700 hover:to-indigo-700
        disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        Payer avec Stripe
      </Button>
    </>
  );
};
