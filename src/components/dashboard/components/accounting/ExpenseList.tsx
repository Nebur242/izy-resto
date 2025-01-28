import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Expense } from '../../../../types/accounting';
import { Button } from '../../../ui/Button';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onAddExpense: () => void;
  onUpdateExpense: (id: string, data: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({
  expenses,
  isLoading,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense
}: ExpenseListProps) {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Liste des Dépenses</h3>
          <Button onClick={onAddExpense}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une Dépense
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3 text-left">Mode de Paiement</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-3">{formatDate(expense.date)}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(expense.amount, settings?.currency)}
                </td>
                <td className="px-4 py-3 capitalize">{expense.paymentMethod}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Handle edit
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}