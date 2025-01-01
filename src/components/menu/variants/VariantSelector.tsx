
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Variant } from '../../../types/variant';
import { MenuItemVariantPrice } from '../../../types/menu';
import { LogoUploader } from '../../settings/LogoUploader';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariants: MenuItemVariantPrice[];
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onVariantChange: (index: number, variantId: string, value: string) => void;
  onPriceChange: (index: number, price: number) => void;
  onImageChange: (index: number, imageUrl: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariants,
  onAddVariant,
  onRemoveVariant,
  onVariantChange,
  onPriceChange,
  onImageChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Variantes du produit</h3>
        <Button onClick={onAddVariant} type="button">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une variante
        </Button>
      </div>

      {selectedVariants.map((variantPrice, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              {/* Variant Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                    value={variantPrice.variantCombination[0]?.split(': ')[0] || ''}
                    onChange={(e) => {
                      const variant = variants.find(v => v.name === e.target.value);
                      if (variant && variant.values.length > 0) {
                        onVariantChange(index, variant.name, variant.values[0]);
                      }
                    }}
                  >
                    <option value="">Sélectionner un type</option>
                    {variants.map(variant => (
                      <option key={variant.id} value={variant.name}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Valeur</label>
                  <select
                    className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                    value={variantPrice.variantCombination[0]?.split(': ')[1] || ''}
                    onChange={(e) => {
                      const variantType = variantPrice.variantCombination[0]?.split(': ')[0];
                      if (variantType) {
                        onVariantChange(index, variantType, e.target.value);
                      }
                    }}
                  >
                    <option value="">Sélectionner une valeur</option>
                    {variants
                      .find(v => v.name === variantPrice.variantCombination[0]?.split(': ')[0])
                      ?.values.map(value => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-medium mb-1">Prix</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  value={variantPrice.price}
                  onChange={(e) => onPriceChange(index, parseFloat(e.target.value))}
                />
              </div>

              {/* Image Uploader */}
              <div>
                <LogoUploader
                  value={variantPrice.image || ''}
                  onChange={(url) => onImageChange(index, url)}
                  label="Image de la variante"
                  description="Image spécifique pour cette variante (optionnel)"
                />
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              type="button"
              onClick={() => onRemoveVariant(index)}
              className="ml-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
