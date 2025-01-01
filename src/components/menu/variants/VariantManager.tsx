import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, XCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Variant } from '../../../types/variant';
import { MenuItemVariantPrice } from '../../../types/menu';
import { VariantCombination } from './VariantCombination';
import toast from 'react-hot-toast';

interface VariantManagerProps {
  variants: Variant[];
  value: MenuItemVariantPrice[];
  onChange: (variants: MenuItemVariantPrice[]) => void;
}

export function VariantManager({ variants, value, onChange }: VariantManagerProps) {
const handleAddCombination = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const newCombination = variants.map(v => {
    const unusedValue = v.values.find(val => 
      !value.some(combo => combo.variantCombination.includes(`${v.name}: ${val}`))
    );
    return `${v.name}: ${unusedValue || ''}`;
  });

  onChange([...value, {
    variantCombination: newCombination,
    price: 0,
    image: ''
  }]);
};

  const handleRemoveCombination = (index: number, e?: React.MouseEvent) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onChange(value.filter((_, i) => i !== index));
  };

  const handleCombinationChange = (index: number, combination: string[]) => {
    // Check if combination already exists in other variants
    const exists = value.some((v, i) => 
      i !== index && // Skip current variant
      JSON.stringify([...v.variantCombination].sort()) === JSON.stringify([...combination].sort())
    );

    if (exists) {
      toast.error('Cette combinaison existe déjà');
      return;
    }

    const newVariants = [...value];
    newVariants[index] = {
      ...newVariants[index],
      variantCombination: combination
    };
    onChange(newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Combinaisons de variantes
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les différentes combinaisons de variantes et leurs prix
          </p>
        </div>
        <Button 
          type="button" // Add type="button"
          onClick={handleAddCombination}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une combinaison
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {value.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="max-w-sm mx-auto">
              <XCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                Aucune combinaison
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Commencez par ajouter une combinaison de variantes
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {value.map((variantPrice, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { duration: 0.2 },
                  opacity: { duration: 0.2 }
                }}
              >
                <VariantCombination
                  variants={variants}
                  combination={variantPrice.variantCombination}
                  price={variantPrice.price}
                  image={variantPrice.image}
                  onCombinationChange={(combination) => handleCombinationChange(index, combination)}
                  onPriceChange={(price) => {
                    const newVariants = [...value];
                    newVariants[index] = { ...newVariants[index], price };
                    onChange(newVariants);
                  }}
                  onImageChange={(url) => {
                    const newVariants = [...value];
                    newVariants[index] = { ...newVariants[index], image: url };
                    onChange(newVariants);
                  }}
                  onRemove={(e) => handleRemoveCombination(index, e)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}