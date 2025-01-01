import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { InventoryItem } from '../../../../types/inventory';
import { useSettings } from '../../../../hooks/useSettings';

interface InventoryFormProps {
  item?: InventoryItem | null;
  onSave: (data: Omit<InventoryItem, 'id'>) => void;
  onCancel: () => void;
}

export function InventoryForm({ item, onSave, onCancel }: InventoryFormProps) {
  const { settings } = useSettings();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<InventoryItem, 'id'>>({
    defaultValues: item ? {
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      unit: item.unit,
      minQuantity: item.minQuantity,
      category: item.category,
      price: item.price,
      supplier: item.supplier || '',
      expiryDate: item.expiryDate || ''
    } : {
      name: '',
      description: '',
      quantity: 0,
      unit: 'unités',
      minQuantity: 0,
      category: 'ingredients',
      price: 0,
      supplier: '',
      expiryDate: ''
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {item ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                {...register('name', { required: 'Le nom est requis' })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                {...register('category')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              >
                <option value="ingredients">Ingrédients</option>
                <option value="beverages">Boissons</option>
                <option value="supplies">Fournitures</option>
                <option value="packaging">Emballages</option>
                <option value="cleaning">Produits d'entretien</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantité</label>
              <input
                type="number"
                {...register('quantity', { 
                  required: 'La quantité est requise',
                  min: { value: 0, message: 'La quantité doit être positive' }
                })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unité</label>
              <select
                {...register('unit')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              >
                <option value="unités">Unités</option>
                <option value="kg">Kilogrammes</option>
                <option value="g">Grammes</option>
                <option value="l">Litres</option>
                <option value="ml">Millilitres</option>
                <option value="cartons">Cartons</option>
                <option value="packs">Packs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantité minimale</label>
              <input
                type="number"
                {...register('minQuantity', { 
                  required: 'La quantité minimale est requise',
                  min: { value: 0, message: 'La quantité minimale doit être positive' }
                })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
              {errors.minQuantity && (
                <p className="mt-1 text-sm text-red-500">{errors.minQuantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Prix unitaire ({settings?.currency})
              </label>
              <input
                type="number"
                step={settings?.currency === 'XOF' ? '1' : '0.01'}
                {...register('price', { 
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fournisseur</label>
              <input
                type="text"
                {...register('supplier')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date d'expiration</label>
              <input
                type="date"
                {...register('expiryDate')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : item ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}