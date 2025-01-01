import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../hooks/useMenu';
import { MenuItem } from './MenuItem';
import { MenuFilters } from './MenuFilters';
import { useFilteredMenu } from '../../hooks/useFilteredMenu';

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { items, isLoading } = useMenu();
  const filteredItems = useFilteredMenu(items, activeCategory);

  return (
    <div className="space-y-8">
      <MenuFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="relative min-h-[50vh]">
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" />

        {isLoading ? (
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={false}
            className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MenuItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="relative flex h-[50vh] items-center justify-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Aucun produit trouvé dans cette catégorie
            </p>
          </div>
        )}
      </div>
    </div>
  );
}