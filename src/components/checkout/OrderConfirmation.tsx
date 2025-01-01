import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Phone, Mail, MapPin, CreditCard, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { usePayments } from '../../hooks/usePayments';
import { QRCodeModal } from './QRCodeModal';
import { CartItem } from '../../types';

interface OrderConfirmationProps {
  customerData: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    tableNumber?: string;
    diningOption: 'delivery' | 'dine-in';
  };
  onConfirm: () => void;
  onBack: () => void;
  showPaymentMethods?: boolean;
}

export function OrderConfirmation({
  customerData,
  onConfirm,
  onBack,
  showPaymentMethods = false
}: OrderConfirmationProps) {
  const { settings } = useSettings();
  const { cart, total } = useCart();
  const { paymentMethods } = usePayments();
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id || '');
  const [showQRCode, setShowQRCode] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPayment);

  const handleConfirm = () => {
    // If selected payment method has QR code and user hasn't confirmed payment
    if (selectedPaymentMethod?.qrCode && !hasPaid) {
      setShowQRCode(true);
      return;
    }
    onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-500" />
          Confirmation de commande
        </h2>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <h3 className="font-medium">Détails Client</h3>
          <div className="space-y-2">
            {customerData.name && (
              <p className="text-gray-600 dark:text-gray-300">
                {customerData.name}
              </p>
            )}
            {customerData.phone && (
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4" />
                {customerData.phone}
              </p>
            )}
            {customerData.email && (
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4" />
                {customerData.email}
              </p>
            )}
            {customerData.diningOption === 'delivery' && customerData.address && (
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4" />
                {customerData.address}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-medium">Articles commandés</h3>
          {cart.map((item: CartItem) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(item.price, settings?.currency)} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {formatCurrency(item.price * item.quantity, settings?.currency)}
              </p>
            </div>
          ))}
          <div className="border-t dark:border-gray-700 pt-3 mt-3">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(total, settings?.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      {showPaymentMethods && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Mode de paiement
          </h3>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label
                key={method.id}
                className={`
                  relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${selectedPayment === method.id
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => {
                    setSelectedPayment(e.target.value);
                    setHasPaid(false);
                  }}
                  className="sr-only"
                />

                {/* Payment Method Icon/Image */}
                {method.qrCode ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <img
                      src={method.qrCode}
                      alt={method.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                {/* Method Name */}
                <div className="flex-1">
                  <p className="font-medium">{method.name}</p>
                </div>

                {/* Selection Indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-colors duration-200 ${
                    selectedPayment === method.id
                      ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <AnimatePresence>
                    {selectedPayment === method.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-2.5 h-2.5 rounded-full bg-white"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={showPaymentMethods && !selectedPayment}
          className={`
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {selectedPaymentMethod?.qrCode && !hasPaid ? (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Scanner pour payer
            </>
          ) : (
            <>
              {hasPaid && <Check className="w-4 h-4 mr-2" />}
              Confirmer la commande
            </>
          )}
        </Button>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && selectedPaymentMethod?.qrCode && (
          <QRCodeModal
            qrCode={selectedPaymentMethod.qrCode}
            onClose={() => {
              setShowQRCode(false);
              setHasPaid(true);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}