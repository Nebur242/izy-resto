import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MenuItem } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { useSettings } from '../../../hooks/useSettings';
import { ProductDetailsModal } from '../ProductDetailsModal';
import { formatCurrency } from '../../../utils/currency';

interface MinimalMenuItemProps {
  item: MenuItem;
}

export function MinimalMenuItem({ item }: MinimalMenuItemProps) {
  const { cart } = useCart();
  const { settings } = useSettings();
  const [showModal, setShowModal] = useState(false);
  const itemInCart = cart.find(cartItem => cartItem.id === item.id);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(item.price, settings?.currency)}
            </span>
            {item.variants && item.variants.length > 0 && (
              <div className="flex gap-2">
                {item.variants.slice(0, 2).map((variant, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    {variant.value}
                  </span>
                ))}
                {item.variants.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                    +{item.variants.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && (
        <ProductDetailsModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}