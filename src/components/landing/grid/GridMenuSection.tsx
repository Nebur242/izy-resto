import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { GridMenuItem } from './GridMenuItem';
import { GridMenuCategories } from './GridMenuCategories';
import { Pagination } from '../../ui/Pagination';
import { SearchBar } from '../../menu/SearchBar';
import { useTranslation } from 'react-i18next';

export function GridMenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { items } = useMenu(
    activeCategory !== 'all' ? activeCategory : undefined
  );

  const ITEMS_PER_PAGE = 9;

  const filteredItems = items.filter(item => {
    const matchesCategory =
      activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const { t } = useTranslation('menu');

  return (
    <div className="space-y-12">
      <SearchBar onSearch={setSearchTerm} />

      <GridMenuCategories
        activeCategory={activeCategory}
        onCategoryChange={category => {
          setActiveCategory(category);
          setCurrentPage(1);
        }}
      />

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
              <GridMenuItem item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
          {t('no-items-founds')}
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
