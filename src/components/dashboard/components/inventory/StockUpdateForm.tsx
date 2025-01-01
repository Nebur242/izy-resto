import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Package, Search, Loader2 } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { InventoryItem } from '../../../../types/inventory';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';

interface StockUpdateFormProps {
  items: InventoryItem[];
  onSubmit: (data: StockUpdate[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface StockUpdate {
  itemId: string;
  quantity: number;
  reason: string;
}

export function StockUpdateForm({ 
  items, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: StockUpdateFormProps) {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{
    updates: StockUpdate[]
  }>({
    defaultValues: {
      updates: items.map(item => ({
        itemId: item.id,
        quantity: 0,
        reason: ''
      }))
    }
  });

  const updates = watch('updates');

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (data: { updates: StockUpdate[] }) => {
    // Filter out items with no quantity change
    const validUpdates = data.updates.filter(update => update.quantity > 0);
    if (validUpdates.length === 0) return;
    
    onSubmit(validUpdates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              Mise à jour des stocks
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enregistrez les produits utilisés aujourd'hui
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              {filteredItems.map((item, index) => {
                const itemIndex = items.findIndex(i => i.id === item.id);
                if (itemIndex === -1) return null;

                return (
                  <div 
                    key={item.id}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Stock actuel: {item.quantity} {item.unit}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Prix unitaire: {formatCurrency(item.price, settings?.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Quantité utilisée
                        </label>
                        <input
                          type="number"
                          {...register(`updates.${itemIndex}.quantity` as const, {
                            min: {
                              value: 0,
                              message: 'La quantité doit être positive'
                            },
                            max: {
                              value: item.quantity,
                              message: 'Quantité supérieure au stock disponible'
                            }
                          })}
                          className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                          disabled={isSubmitting}
                        />
                        {errors.updates?.[itemIndex]?.quantity && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.updates[itemIndex].quantity?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Raison
                        </label>
                        <input
                          type="text"
                          {...register(`updates.${itemIndex}.reason` as const, {
                            validate: value => {
                              const quantity = updates[itemIndex].quantity;
                              if (quantity > 0 && !value) {
                                return 'La raison est requise';
                              }
                              return true;
                            }
                          })}
                          placeholder="Ex: Service du soir"
                          className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                          disabled={isSubmitting}
                        />
                        {errors.updates?.[itemIndex]?.reason && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.updates[itemIndex].reason?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">Aucun produit trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !updates.some(u => u.quantity > 0)}
                className="min-w-[200px] relative"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  'Mettre à jour les stocks'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
