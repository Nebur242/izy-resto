import { SetStateAction, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuFilters } from './menu/MenuFilters';
import { SearchBar } from './menu/SearchBar';
import { MenuItem } from './menu/MenuItem';
import { useMenu } from '../hooks';

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { items, isLoading } = useMenu();

  const ITEMS_PER_PAGE = 9;

  // Filter items based on both category and search term
  const filteredItems = items.filter(item => {
    const matchesCategory =
      activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleCategoryChange = (category: SetStateAction<string>) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (term: SetStateAction<string>) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const goToPage = (page: SetStateAction<number>) => {
    setCurrentPage(page);
    // Smooth scroll to top of menu section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Category Filters */}
      <MenuFilters
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
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
          <>
            <motion.div
              initial={false}
              className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {currentItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.3,
                        delay: index * 0.05,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    className="relative"
                  >
                    <MenuItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 
                           dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 
                           transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border 
                                transition-colors ${
                                  currentPage === page
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 
                           dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 
                           transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex h-[50vh] items-center justify-center"
          >
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Aucun produit trouvé
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
