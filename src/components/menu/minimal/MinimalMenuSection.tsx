import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { MinimalMenuItem } from './MinimalMenuItem';
import { MinimalMenuCategories } from './MinimalMenuCategories';
import { SearchBar } from '../SearchBar';
import { Pagination } from '../../ui/Pagination';

const ITEMS_PER_PAGE = 8;

export function MinimalMenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { items, isLoading } = useMenu(
    activeCategory !== 'all' ? activeCategory : undefined
  );

  // Filter items based on search
  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <SearchBar onSearch={setSearchTerm} />

      <MinimalMenuCategories
        activeCategory={activeCategory}
        onCategoryChange={category => {
          setActiveCategory(category);
          setCurrentPage(1); // Reset to first page on category change
        }}
      />

      <motion.div layout className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        {paginatedItems.map(item => (
          <MinimalMenuItem key={item.id} item={item} />
        ))}
      </motion.div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun produit trouvé
          </p>
        </div>
      ) : (
        totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )
      )}
    </div>
  );
}
