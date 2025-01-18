import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Tag, Layers, ChevronRight } from 'lucide-react';
import { Variant } from '../../../../types/variant';
import { Category } from '../../../../types';
import { Button } from '../../../ui/Button';
import { Pagination } from '../../../ui/Pagination';

interface VariantListProps {
  variants: Variant[];
  categories: Category[];
  isLoading: boolean;
  onEdit: (variant: Variant) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 6;

export function VariantList({ variants, categories, isLoading, onEdit, onDelete }: VariantListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(variants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVariants = variants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getCategoryBadges = (categoryIds: string[]) => {
    return categoryIds.map(id => {
      const category = categories.find(c => c.id === id);
      if (!category) return null;
      
      return (
        <span
          key={id}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
        >
          {category.name}
        </span>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {paginatedVariants.map((variant, index) => (
            <motion.div
              key={variant.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Variant Content */}
              <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {variant.name}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {getCategoryBadges(variant.categoryIds)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onEdit(variant)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(variant.id)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Values */}
                <div className="flex flex-wrap gap-1.5">
                  {variant.values.map((value, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}