import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { useSettings } from '../../../hooks/useSettings';
import { MenuItemImage } from '../MenuItemImage';

interface GridMenuItemProps {
  item: MenuItem;
}

export function GridMenuItem({ item }: GridMenuItemProps) {
  const { addToCart, cart } = useCart();
  const { settings } = useSettings();
  const itemInCart = cart.find(cartItem => cartItem.id === item.id);

  const formatPrice = (price: number) => {
    switch (settings?.currency) {
      case 'EUR':
        return `€${price.toFixed(2)}`;
      case 'XOF':
        return `${price.toFixed(2)} FCFA`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow transition-transform hover:scale-[1.01]"
    >
      <MenuItemImage item={item} className="w-full h-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end transition-opacity">
        <div className="flex items-center justify-between">
          <div className="text-white space-y-1">
            <h3 className="font-semibold text-white">{item.name}</h3>
            <span className="font-medium text-sm">
              {formatPrice(item.price)}
            </span>
          </div>
          <button
            onClick={() => addToCart(item)}
            className="flex items-center gap-1 text-xs font-medium text-white bg-white/20 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
          >
            {itemInCart ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                More
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
