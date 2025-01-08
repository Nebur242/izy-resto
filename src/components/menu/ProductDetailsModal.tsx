import { useState, useRef, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MenuItem, MenuItemWithVariants } from '../../types/menu';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';

interface ProductDetailsModalProps {
  item: MenuItemWithVariants | null;
  onClose: () => void;
  onAddToCart?: (item: MenuItem & { quantity: number }) => void;
}

export function ProductDetailsModal({
  item,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { addToCart, cart } = useCart();
  const { settings } = useSettings();
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [variantCombinationError, setVariantCombinationError] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (!item) return null;

  const itemWithVariants = item as MenuItemWithVariants;
  const isOutOfStock = item.stockQuantity === 0;

  const getVariantPrice = () => {
    if (!itemWithVariants.variantPrices?.length) return item.price;

    const variantPrice = itemWithVariants.variantPrices.find(
      vp =>
        JSON.stringify(vp.variantCombination.sort()) ===
        JSON.stringify(selectedVariants.sort())
    );

    return variantPrice?.price || item.price;
  };

  const getVariantImage = () => {
    if (!itemWithVariants.variantPrices?.length) return item.image;

    const variantPrice = itemWithVariants.variantPrices.find(
      vp =>
        JSON.stringify(vp.variantCombination.sort()) ===
        JSON.stringify(selectedVariants.sort())
    );

    return variantPrice?.image || item.image;
  };

  const getVariantId = () => {
    if (!selectedVariants.length) return item.id;
    return `${item.id}-${selectedVariants.sort().join('-')}`;
  };

  const variantTypes = itemWithVariants.variantPrices?.reduce((acc, vp) => {
    vp.variantCombination.forEach(combo => {
      const [type, value] = combo.split(': ');
      if (!acc[type]) {
        acc[type] = new Set();
      }
      acc[type].add(value);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  const handleVariantSelect = (variant: string) => {
    const [type] = variant.split(': ');

    setVariantCombinationError('');

    setSelectedVariants(prev => {
      // If the clicked variant is already selected, deselect it
      if (prev.includes(variant)) {
        return prev.filter(v => v !== variant);
      }

      // Filter out variants of the same type as the clicked one
      const filtered = prev.filter(v => !v.startsWith(`${type}: `));

      // Add the clicked variant to the selection
      const updatedSelection = [...filtered, variant];

      // Filter out incompatible variants
      const validSelection = updatedSelection.filter(selectedVariant => {
        return item.variantPrices.some(({ variantCombination }) =>
          updatedSelection.every(v => variantCombination.includes(v))
        );
      });

      if (validSelection.length < 1) {
        setVariantCombinationError('Combinaison inexistant...');
      }

      // console.log('validSelection', validSelection);

      return validSelection;
    });
  };

  const getVariantValues = () => {
    return selectedVariants
      .map(v => v.split(': ')[1])
      .filter(value => value && value.length > 0)
      .join(' ');
  };

  const getCartItem = () => {
    const variantId = getVariantId();
    return cart.find(item => item.id === variantId);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const variantValues = getVariantValues();
    const productName = variantValues
      ? `${item.name} ${variantValues}`
      : item.name;
    const variantId = getVariantId();

    const cartItem = {
      ...item,
      id: variantId,
      name: productName,
      price: getVariantPrice(),
      image: getVariantImage(),
      selectedVariants,
      quantity,
    };

    if (onAddToCart) {
      onAddToCart(cartItem);
    } else {
      addToCart(cartItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="h-48 sm:h-64 w-full overflow-hidden">
          <motion.img
            key={getVariantImage()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={getVariantImage()}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Product Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {item.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>

            {/* Stock Status */}
            <div
              className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg ${
                isOutOfStock
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : item.stockQuantity <= 5
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              <span className="text-[10px] sm:text-xs font-medium">
                {isOutOfStock
                  ? 'Rupture de stock'
                  : `${item.stockQuantity} unités disponibles`}
              </span>
            </div>

            {/* Variants Selection */}
            {variantTypes &&
              Object.entries(variantTypes).map(([type, values]) => {
                if (!values.size || Array.from(values).every(v => !v.length)) {
                  return null;
                }

                return (
                  <div key={type}>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {type}
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {Array.from(values).map(value => {
                        if (!value.length) return null;

                        const variantString = `${type}: ${value}`;

                        const isSelected =
                          selectedVariants.includes(variantString);

                        return (
                          <button
                            key={value}
                            onClick={() => handleVariantSelect(variantString)}
                            className={`
                            px-3 py-1.5 rounded-full text-xs font-medium 
                            transition-all duration-300 ease-in-out
                            ${
                              isSelected
                                ? 'bg-blue-600 text-white scale-105 shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-105'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                            disabled={isOutOfStock}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {/* Cart Item Indicator */}
            {getCartItem() && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 sm:p-2.5 rounded-lg text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-medium text-center">
                Déjà dans le panier: {getCartItem()?.quantity}{' '}
                {getCartItem()?.quantity > 1 ? 'unités' : 'unité'}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          {/* Quantity and Price */}
          <div className="flex items-center justify-between pb-5">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={isOutOfStock}
                className="h-8 w-8 rounded-full p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setQuantity(q => Math.min(item.stockQuantity, q + 1))
                }
                disabled={isOutOfStock || quantity >= item.stockQuantity}
                className="h-8 w-8 rounded-full p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(getVariantPrice() * quantity, settings?.currency)}
            </div>
          </div>

          {variantCombinationError && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>{variantCombinationError}</div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold 
                      flex items-center justify-center gap-2
                      bg-blue-600 text-white 
                      hover:bg-blue-700 
                      focus:ring-2 focus:ring-blue-300 
                      transition-all duration-300 ease-in-out
                      disabled:bg-gray-300 disabled:cursor-not-allowed
                      dark:bg-blue-500 dark:hover:bg-blue-600
                      dark:disabled:bg-gray-700"
          >
            <ShoppingBag className="h-5 w-5" />
            {isOutOfStock ? 'Rupture de stock' : 'Ajouter au Panier'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
