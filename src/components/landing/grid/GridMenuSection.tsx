import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { GridMenuItem } from './GridMenuItem';
import { GridMenuCategories } from './GridMenuCategories';

export function GridMenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { items, isLoading } = useMenu(); // Fetch all items once

  // Filter items client-side based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter(item => item.categoryId === activeCategory);
  }, [items, activeCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <GridMenuCategories
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredItems.map(item => (
          <GridMenuItem key={item.id} item={item} />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No items found in this category
          </p>
        </div>
      )}
    </div>
  );
}