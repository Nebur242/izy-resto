// GridMenuSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { GridMenuItem } from './GridMenuItem';
import { GridMenuCategories } from './GridMenuCategories';

export function GridMenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { items, isLoading } = useMenu(activeCategory !== 'all' ? activeCategory : undefined);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        <GridMenuCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {items.map(item => (
          <GridMenuItem key={item.id} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
