import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { CartItem } from './CartItem';
import { CheckoutForm } from '../checkout/CheckoutForm';
import { formatCurrency } from '../../utils/currency';

export function Cart() {
  const { t } = useTranslation();
  const { cart, total } = useCart();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price: number) => {
    switch (settings?.currency) {
      case 'EUR':
        return `€${price.toFixed(2)}`;
      case 'XOF':
        return `${price.toFixed(0)} FCFA`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all z-50 hover:scale-105 active:scale-95"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
          {cart.length}
        </span>
      </button>

      {/* Cart Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Sidebar */}
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-gray-50 dark:bg-gray-800 shadow-xl z-50 flex flex-col transition-transform duration-300 py-5">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Votre Panier ({cart.length})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isCheckingOut ? (
                <CheckoutForm
                  onSuccess={() => {
                    setIsCheckingOut(false);
                    setIsOpen(false);
                  }}
                  onCancel={() => setIsCheckingOut(false)}
                />
              ) : (
                cart.map(item => <CartItem key={item.id} item={item} />)
              )}
            </div>

            {/* Footer */}
            {!isCheckingOut && cart.length > 0 && (
              <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Total Panier
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(total, settings?.currency)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Passer la commande
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
