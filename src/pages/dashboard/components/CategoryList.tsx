import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, GripVertical, ChevronRight } from 'lucide-react';
import { Category } from '../../../types';
import { Button } from '../../../components/ui/Button';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Order Indicator */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
              {index + 1}
            </div>

            <div className="flex items-center p-4">
              {/* Drag Handle (visual only) */}
              <div className="mr-3 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {category.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                {category.description && (
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Display Order Info */}
            {category.order !== undefined && category.order !== null && (
              <div className="absolute right-4 top-0 -translate-y-1/2 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-600 dark:text-blue-400">
                Ordre: {category.order}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
            <Edit2 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Aucune catégorie
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Commencez par ajouter une nouvelle catégorie
          </p>
        </div>
      )}
    </div>
  );
}