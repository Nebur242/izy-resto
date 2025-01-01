import React, { useState } from 'react';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../../../../types/inventory';
import { Button } from '../../../ui/Button';
import { formatDate } from '../../../../utils/date';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { Pagination } from '../../../ui/Pagination';

const ITEMS_PER_PAGE = 8;

interface InventoryListProps {
  items: InventoryItem[];
  isLoading: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryList({ items, isLoading, onEdit, onDelete }: InventoryListProps) {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="px-4 py-3 text-left">Produit</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-right">Quantité</th>
              <th className="px-4 py-3 text-right">Prix Unitaire</th>
              <th className="px-4 py-3 text-left">Date d'expiration</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => {
              const numericPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
              
              return (
                <tr
                  key={item.id}
                  className="border-b dark:border-gray-700"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.quantity <= item.minQuantity && (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${
                      item.quantity <= item.minQuantity ? 'text-red-500' : ''
                    }`}>
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(numericPrice, settings?.currency)}
                  </td>
                  <td className="px-4 py-3">
                    {item.expiryDate ? formatDate(item.expiryDate) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
  );
}