import React from 'react';
import { Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { CartItem } from '../../types';
import { useSettings } from '../../hooks/useSettings';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const { settings } = useSettings();
  
  // Calculate total number of items by summing quantities
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium">Résumé de la Commande</h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {totalItems} {totalItems > 1 ? 'articles' : 'article'}
          </span>
          <span className="font-medium">
            {formatCurrency(total, settings?.currency)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-semibold border-t dark:border-gray-700 pt-4">
        <span>Total</span>
        <span className="text-blue-600 dark:text-blue-400">
          {formatCurrency(total, settings?.currency)}
        </span>
      </div>
    </div>
  );
}