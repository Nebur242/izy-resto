import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { MenuItem, MenuItemWithVariants } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useVariants } from '../../hooks/useVariants';
import { useSettings } from '../../hooks/useSettings';
import { LogoUploader } from '../settings/LogoUploader';
import { VariantManager } from './variants/VariantManager';

interface MenuItemFormProps {
  item?: MenuItem | null;
  onSave: (data: MenuItemWithVariants) => void;
  onCancel: () => void;
}

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const { categories } = useCategories();
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState(
    item?.categoryId || ''
  );
  const { variants } = useVariants(selectedCategory);
  const [variantPrices, setVariantPrices] = useState(
    (item as MenuItemWithVariants)?.variantPrices || []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      image: item?.image || '',
      categoryId: item?.categoryId || '',
      stockQuantity: item?.stockQuantity || 0,
    },
  });

  // Sync category when editing existing item
  useEffect(() => {
    if (item?.categoryId) {
      setSelectedCategory(item.categoryId);
      setValue('categoryId', item.categoryId);
    }
  }, [item?.categoryId, setValue]);

  const handleFormSubmit = (formData: any) => {
    // Filter out variant prices where not all variants are selected
    const filteredVariantPrices = variantPrices.filter(vp => {
      // Check if all variant values in this combination are non-empty
      return Object.values(vp.variantCombination).every(
        value => value !== '' && value !== null && value !== undefined
      );
    });

    // const exists = variantPrices.some(
    //   (v, i) =>
    //     i !== index && // Skip current variant
    //     JSON.stringify([...v.variantCombination].sort()) ===
    //       JSON.stringify([...combination].sort())
    // );

    // if (exists) {
    //   toast.error('Cette combinaison existe déjà');
    //   return;
    // }

    const menuItem: MenuItemWithVariants = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      variantPrices: filteredVariantPrices.map(vp => ({
        ...vp,
        price: Number(vp.price),
      })),
    };
    onSave(menuItem);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log(value);
    setSelectedCategory(value);
    setValue('categoryId', value, { shouldDirty: true });
    // Reset variant prices if category changes
    if (value !== item?.categoryId) {
      setVariantPrices([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {item ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom
              </label>
              <input
                type="text"
                {...register('name', { required: 'Le nom est requis' })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 
                        bg-white dark:bg-gray-700 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        dark:text-white dark:placeholder-gray-400
                        transition-colors"
                placeholder="Nom du produit"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                {...register('categoryId', {
                  required: 'La catégorie est requise',
                })}
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 
                        bg-white dark:bg-gray-700 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        dark:text-white
                        transition-colors"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix
              </label>
              <div className="relative">
                <input
                  type="number"
                  step={settings?.currency === 'XOF' ? '1' : '0.01'}
                  {...register('price', {
                    required: 'Le prix est requis',
                    min: { value: 0, message: 'Le prix doit être positif' },
                  })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 
                          bg-white dark:bg-gray-700 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          dark:text-white
                          transition-colors pr-12"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 dark:text-gray-400">
                  {settings?.currency}
                </div>
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register('stockQuantity', {
                  required: 'Le stock est requis',
                  min: { value: 0, message: 'Le stock doit être positif' },
                })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 
                        bg-white dark:bg-gray-700 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        dark:text-white
                        transition-colors"
                placeholder="0"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register('description', {
                  required: 'La description est requise',
                })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 
                        bg-white dark:bg-gray-700 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        dark:text-white
                        transition-colors"
                placeholder="Description du produit"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <LogoUploader
                value={watch('image')}
                onChange={url => setValue('image', url, { shouldDirty: true })}
                label="Image du produit"
                description="Format recommandé: JPG ou PNG en haute résolution (1920x1080px minimum)"
              />
            </div>
          </div>

          {/* Variants */}
          {selectedCategory && variants.length > 0 && (
            <div className="border-t dark:border-gray-700 pt-6">
              <VariantManager
                variants={variants}
                value={variantPrices}
                onChange={setVariantPrices}
              />
            </div>
          )}

          {/* Actions */}
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
               dark:hover:bg-gray-700 transition-all duration-200 rounded-lg
               hover:shadow-sm active:scale-95"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 
               hover:from-blue-600 hover:to-indigo-700 text-white font-medium 
               rounded-lg shadow-sm hover:shadow-md transition-all duration-200 
               active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {item ? 'Mettre à jour' : 'Ajouter'}
              </span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
