import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter } from 'lucide-react';

interface MenuFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuFilters({
  activeCategory,
  onCategoryChange,
}: MenuFiltersProps) {
  const { categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const activeCategoryName =
    activeCategory === 'all'
      ? 'Menu principal'
      : categories.find(c => c.id === activeCategory)?.name || 'Sélectionner';

  if (isLoading) {
    return (
      <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full" />
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-sm
                 border border-gray-200 dark:border-gray-700 flex items-center justify-between
                 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">{activeCategoryName}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Desktop Categories */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-2 w-full overflow-x-auto py-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 min-w-0">
          <motion.button
            onClick={() => onCategoryChange('all')}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-200 hover:scale-105
              ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }
            `}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Menu principal
          </motion.button>

          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200 hover:scale-105
                ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mobile Categories Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="lg:hidden absolute left-0 right-0 top-full mt-2 py-2 bg-white dark:bg-gray-800 
                     rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50
                     max-h-[60vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                onCategoryChange('all');
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left text-sm transition-colors
                ${
                  activeCategory === 'all'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
              `}
            >
              Menu principal
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left text-sm transition-colors
                  ${
                    activeCategory === category.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
