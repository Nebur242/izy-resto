import React from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { MinimalMenuItem } from './MinimalMenuItem';
import { MinimalMenuCategories } from './MinimalMenuCategories';
import { useState } from 'react';

export function MinimalMenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { items, isLoading } = useMenu(activeCategory !== 'all' ? activeCategory : undefined);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <MinimalMenuCategories
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <motion.div layout className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        {items.map(item => (
          <MinimalMenuItem key={item.id} item={item} />
        ))}
      </motion.div>
    </div>
  );
}