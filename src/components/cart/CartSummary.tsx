import React from 'react';
import { CartItem as CartItemType } from '../../types';

interface CartSummaryProps {
  items: CartItemType[];
  total: number;
}

export function CartSummary({ items, total }: { items: CartItemType[]; total: number }) {
  const { settings } = useSettings();

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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Order Summary
      </h3>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                {item.quantity}
              </span>
              <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
          <span className="font-medium text-gray-900 dark:text-white">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600 dark:text-gray-300">Taxes</span>
          <span className="font-medium text-gray-900 dark:text-white">{formatPrice(total * 0.2)}</span>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(total * 1.2)}
          </span>
        </div>
      </div>
    </div>
  );
}

