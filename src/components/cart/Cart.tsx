import { ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import useTextColor from '../../hooks/useTextColor';
import { formatCurrency } from '../../utils/currency';
import { formatTaxRate } from '../../utils/tax';
import { CheckoutForm } from '../checkout/CheckoutForm';
import { Button } from '../ui/Button';
import { CartItem } from './CartItem';

export function Cart() {
  const textClasses = useTextColor();
  const { cart, total, taxes, subtotal } = useCart();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Hide cart if empty
  if (!cart.length) return null;

  return (
    <div className="w-full relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 ${
          settings?.theme?.paletteColor?.colors[0]?.class || 'bg-blue-600'
        } text-white p-4 rounded-full shadow-lg transition-all z-50 hover:scale-105 active:scale-95`}
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
          {cart.length}
        </span>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed inset-y-0  right-0 w-full md:w-96 bg-gray-50 dark:bg-gray-800 shadow-xl z-50 flex flex-col py-5 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
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
        {!isCheckingOut && (
          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="space-y-2">
              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Sous-total</span>
                <span>{formatCurrency(subtotal, settings?.currency)}</span>
              </div>

              {/* Taxes */}
              {taxes.map(tax => (
                <div
                  key={tax.id}
                  className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                >
                  <span>
                    {tax.name} ({formatTaxRate(tax.rate)})
                  </span>
                  <span>{formatCurrency(tax.amount, settings?.currency)}</span>
                </div>
              ))}

              {/* Total */}
              <div className="pt-2 border-t dark:border-gray-700 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <span>Total Panier</span>
                  <span
                    className={`text-xl font-bold text-neutral-700 dark:text-white`}
                  >
                    {formatCurrency(total, settings?.currency)}
                  </span>
                </div>
                <Button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full px-6 py-3 rounded-xl shadow-md"
                >
                  Passer la commande
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
