import { motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { MenuItem } from '../../../types';
import { useSettings } from '../../../hooks/useSettings';
import { Plus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { MenuItemImage } from '../../menu/MenuItemImage';

export function FastFoodMenu() {
  const { items } = useMenu();
  const { settings } = useSettings();
  const { addToCart } = useCart();

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

  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = [];
    }
    acc[item.categoryId].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-16">
      {Object.entries(itemsByCategory).map(([categoryId, items]) => (
        <div key={categoryId} id={categoryId} className="space-y-8">
          <h2 className="text-3xl font-bold text-white">
            {items[0]?.category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-red-500/20"
              >
                <div className="aspect-video relative overflow-hidden">
                  <MenuItemImage
                    item={item}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => addToCart(item)}
                    className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-red-500">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
