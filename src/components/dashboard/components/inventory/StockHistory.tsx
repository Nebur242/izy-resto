
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, TrendingDown, Calendar } from 'lucide-react';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { Pagination } from '../../../ui/Pagination';
import { StockHistory as StockHistoryType } from '../../../../types/inventory';

interface StockHistoryProps {
  updates?: StockHistoryType[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StockHistory({
  updates = [],
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}: StockHistoryProps) {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
              <div className="h-8 bg-gray-100 dark:bg-gray-700/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!updates || updates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun historique
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Les mises à jour de stock apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y dark:divide-gray-700">
        <AnimatePresence mode="popLayout">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {update.itemName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {update.reason}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(update.date)}
                      </span>
                      <span>•</span>
                      <span className="text-red-500 dark:text-red-400 font-medium">
                        -{update.quantity} unités
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {formatCurrency(update.cost, settings?.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
