import { forwardRef, useState } from 'react';
import { MenuItem as MenuItemType } from '../../types';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { ProductDetailsModal } from './ProductDetailsModal';
import { formatCurrency } from '../../utils/currency';

interface MenuItemProps {
  item: MenuItemType;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ item }, ref) => {
    const { cart } = useCart();
    const { settings } = useSettings();
    const [showModal, setShowModal] = useState(false);
    const itemInCart = cart.find(cartItem => cartItem.id === item.id);
    const isOutOfStock = item.stockQuantity === 0;

    return (
      <>
        <div
          ref={ref}
          onClick={() => !isOutOfStock && setShowModal(true)}
          className={`group relative overflow-hidden bg-white shadow-sm transition-all duration-300 dark:bg-gray-800
          md:flex md:flex-col
          ${
            !isOutOfStock &&
            'hover:shadow-md hover:translate-y-[-2px] cursor-pointer'
          }
          
          /* Mobile Specific (Default) */
          flex h-32 w-full rounded-xl
          
          /* Tablet and up */
          md:h-auto md:rounded-2xl
        `}
        >
          {/* Image Container */}
          <div className="relative h-full w-32 flex-shrink-0 overflow-hidden md:h-auto md:w-full md:aspect-[4/3]">
            <img
              src={item.image}
              alt={item.name}
              className={`h-full w-full object-cover transition-transform duration-500 
              ${!isOutOfStock && 'group-hover:scale-105'}
            `}
            />

            {/* Stock Status */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs md:text-sm font-medium text-white shadow-lg">
                  Rupture de stock
                </span>
              </div>
            )}

            {/* Low Stock Warning - Only on Desktop */}
            {!isOutOfStock && item.stockQuantity <= 5 && (
              <Badge
                variant="warning"
                className="absolute left-2 top-2 hidden shadow-lg md:flex md:left-4 md:top-4"
              >
                Plus que {item.stockQuantity}
              </Badge>
            )}

            {/* Price Badge */}
            <div className="absolute right-2 top-2 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-gray-900 shadow-lg backdrop-blur-sm dark:bg-gray-900/95 dark:text-white md:right-4 md:top-4 md:px-4 md:py-2">
              {formatCurrency(item.price, settings?.currency)}
            </div>

            {/* Cart Badge - Mobile Position */}
            {itemInCart && (
              <Badge
                variant="success"
                className="absolute left-2 bottom-2 z-10 shadow-lg md:left-4 md:bottom-4"
              >
                {itemInCart.quantity}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-3 md:p-5">
            {/* Title and Description */}
            <div>
              <h3 className="mb-1 text-base font-semibold text-gray-900 line-clamp-1 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 md:text-lg md:mb-2">
                {item.name}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-3 dark:text-gray-300">
                {item.description}
              </p>

              {/* Mobile Description - One line only */}
              <p className="text-sm text-gray-600 line-clamp-1 dark:text-gray-300 md:hidden">
                {item.description}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto">
              {/* Stock Info - Desktop Only */}
              {!isOutOfStock && (
                <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                  {item.stockQuantity} unités disponibles
                </div>
              )}

              {/* Variants Preview - Mobile Optimized */}
              {/* {console.log(item.variants)} */}
              {item.variants && item.variants.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1 md:mt-3 md:gap-2">
                  {item.variants.slice(0, 1).map((variant, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300 md:px-3 md:py-1"
                    >
                      {variant.value}
                    </span>
                  ))}
                  {item.variants.length > 1 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 md:px-3 md:py-1">
                      +{item.variants.length - 1} options
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <ProductDetailsModal
            item={item}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }
);

MenuItem.displayName = 'MenuItem';
