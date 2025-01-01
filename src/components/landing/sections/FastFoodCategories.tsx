import React from 'react';
import { motion } from 'framer-motion';
import { useCategories } from '../../../hooks/useCategories';

export function FastFoodCategories() {
  const { categories } = useCategories();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
        Nos Catégories
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.a
            key={category.id}
            href={`#${category.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-white text-center group-hover:scale-110 transition-transform">
                {category.name}
              </h3>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}