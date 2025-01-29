import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { settings } = useSettings();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex gap-4">
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="absolute w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
            {item.name[0]}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.name}
            </h3>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(item.price, settings?.currency)}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Quantity */}
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="text-gray-700 dark:text-gray-200 font-medium w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
