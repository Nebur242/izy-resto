import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { GridMenuItem } from './GridMenuItem';
import { GridMenuCategories } from './GridMenuCategories';
import { Pagination } from '../../ui/Pagination';
import { SearchBar } from '../../menu/SearchBar';

const ITEMS_PER_PAGE = 12;

export function GridMenuSection() {
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

  return (
    <div className="space-y-12">
      <SearchBar onSearch={setSearchTerm} />

      <GridMenuCategories
        activeCategory={activeCategory}
        onCategoryChange={category => {
          setActiveCategory(category);
          setCurrentPage(1); // Reset to first page on category change
        }}
      />

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {paginatedItems.map(item => (
          <GridMenuItem key={item.id} item={item} />
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
