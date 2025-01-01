import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../hooks/useCategories';
import { UtensilsCrossed, ChevronRight } from 'lucide-react';

interface MenuFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuFilters({ activeCategory, onCategoryChange }: MenuFiltersProps) {
  const { categories, isLoading } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // More robust overflow check
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const overflow = container.scrollWidth > container.clientWidth;
        
        // Set overflow state, ensuring it only shows when we have more than 2 categories
        const shouldShowHint = overflow && categories.length > 2;
        setIsOverflowing(shouldShowHint);
        
        // Show hint only if overflowing
        if (shouldShowHint) {
          setShowScrollHint(true);
          
          // Hide hint after 10 seconds
          const timeoutId = setTimeout(() => {
            setShowScrollHint(false);
          }, 10000);

          return () => clearTimeout(timeoutId);
        }
      }
    };

    // Check immediately and on resize
    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    // Timeout to recheck after rendering
    const timeoutId = setTimeout(checkOverflow, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [categories]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative h-12 w-12"
        >
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 dark:border-blue-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 relative">
      {/* Scroll hint positioned above the container */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-8 right-6 flex items-center text-gray-500 dark:text-gray-400 text-xs z-10"
          >
            <span className="mr-1">Délifer pour voir les catégories</span>
            <ChevronRight className="w-3 h-3" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll gradient overlay */}
      {isOverflowing && (
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="w-full flex justify-between">
            <div className="w-8 h-full bg-gradient-to-r from-white/50 to-transparent dark:from-gray-900/50" />
            <div className="w-8 h-full bg-gradient-to-l from-white/50 to-transparent dark:from-gray-900/50" />
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white/50 p-2 shadow-sm backdrop-blur-sm dark:bg-gray-800/50">
        {/* Category Filters */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar relative flex snap-x gap-2 overflow-x-auto scroll-smooth px-2"
        >
          {/* All Dishes Category */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`
              relative min-w-fit snap-start flex items-center gap-2 
              rounded-full px-4 py-2 text-sm font-medium 
              transition-all hover:shadow-md
              ${activeCategory === 'all' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}
            `}
          >
            <UtensilsCrossed className="h-4 w-4" />
            <span>Tous les plats</span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                relative min-w-fit snap-start flex items-center 
                rounded-full px-4 py-2 text-sm font-medium 
                transition-all hover:shadow-md
                ${activeCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}
              `}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}