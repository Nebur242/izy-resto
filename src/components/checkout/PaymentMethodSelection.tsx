import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet } from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { usePayments } from '../../hooks/usePayments';

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelection({ selectedMethod, onSelect }: PaymentMethodSelectionProps) {
  const { paymentMethods, isLoading } = usePayments();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-gray-500" />
        Méthode de paiement
      </h3>

      <div className="grid gap-3">
        {paymentMethods.map(method => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(method)}
            className={`relative w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            {/* Payment Icon/Image */}
            {method.qrCode ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <img 
                  src={method.qrCode} 
                  alt={method.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-gray-400" />
              </div>
            )}
            
            {/* Method Name */}
            <div className="flex-1 text-left">
              <p className="font-medium">{method.name}</p>
            </div>

            {/* Selection Indicator */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200 ${
                            selectedMethod?.id === method.id
                              ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
            >
              <AnimatePresence>
                {selectedMethod?.id === method.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-2.5 h-2.5 rounded-full bg-white"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}