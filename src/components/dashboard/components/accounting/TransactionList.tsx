import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../../../../types/accounting';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { Button } from '../../../ui/Button';
import { TransactionForm } from './TransactionForm';
import { ConfirmationModal } from '../../../ui/ConfirmationModal';
import { Pagination } from '../../../ui/Pagination';

const ITEMS_PER_PAGE = 8;

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onUpdate: (id: string, data: Partial<Transaction>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const sourceText: Record<string, string> = {
  orders: 'commandes',
  inventory: 'Inventaire',
};

export function TransactionList({
  transactions,
  isLoading,
  onUpdate,
  onDelete,
}: TransactionListProps) {
  const { settings } = useSettings();
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  // Initialize with the last page
  const [currentPage, setCurrentPage] = useState(totalPages || 1);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    transactionId?: string;
  }>({ isOpen: false });

  // Keep currentPage in sync with data changes
  useEffect(() => {
    if (totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  // Get transactions for current page
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Source
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Référence
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                  Débit
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                  Crédit
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                  Brut
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="wait">
                {paginatedTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                    }}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {sourceText[transaction.source]}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {transaction.debit > 0 && (
                        <span className="text-red-600 dark:text-red-400">
                          {formatCurrency(
                            transaction.debit,
                            settings?.currency
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {transaction.credit > 0 && (
                        <span className="text-green-600 dark:text-green-400">
                          {formatCurrency(
                            transaction.credit,
                            settings?.currency
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      {formatCurrency(transaction.gross, settings?.currency)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteConfirmation({
                              isOpen: true,
                              transactionId: transaction.id,
                            })
                          }
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {paginatedTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune transaction trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Transaction Edit Modal */}
      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={async data => {
            await onUpdate(editingTransaction.id, data);
            setEditingTransaction(null);
          }}
          onCancel={() => setEditingTransaction(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={async () => {
          if (deleteConfirmation.transactionId) {
            await onDelete(deleteConfirmation.transactionId);
            setDeleteConfirmation({ isOpen: false });
          }
        }}
        title="Supprimer la transaction"
        message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
      />
    </>
  );
}
