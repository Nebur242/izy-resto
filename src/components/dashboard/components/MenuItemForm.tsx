{/* Previous imports remain the same */}

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  // Previous state declarations remain the same

  const handleVariantChange = (combination: string[], field: 'price' | 'image', value: string | number) => {
    setVariantPrices(prev => {
      const existing = prev.findIndex(
        p => JSON.stringify(p.variantCombination) === JSON.stringify(combination)
      );
      
      if (existing >= 0) {
        return prev.map((p, i) => i === existing ? { ...p, [field]: value } : p);
      }
      
      return [...prev, { 
        variantCombination: combination, 
        price: field === 'price' ? value as number : formData.price,
        image: field === 'image' ? value as string : undefined
      }];
    });
  };

  // Rest of the component remains the same until the variants section

  {/* Inside the form, update the variants section */}
  {selectedCategory && variants.length > 0 && (
    <div className="border-t dark:border-gray-700 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium">Variantes, Prix et Images</h4>
        <span className="text-sm text-gray-500">
          {variants.length} variante(s) disponible(s)
        </span>
      </div>

      <div className="space-y-6">
        {getVariantCombinations().map((combination, index) => {
          const variantPrice = variantPrices.find(
            p => JSON.stringify(p.variantCombination) === JSON.stringify(combination)
          );
          
          return (
            <div 
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                {combination.map((value, vIndex) => (
                  <span
                    key={vIndex}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={settings?.currency === 'XOF' ? '1' : '0.01'}
                      value={variantPrice?.price || formData.price}
                      onChange={e => handleVariantChange(combination, 'price', parseFloat(e.target.value))}
                      className="w-full rounded-lg border dark:border-gray-600 p-2 pl-8 dark:bg-gray-700"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {settings?.currency === 'EUR' ? '€' : settings?.currency === 'XOF' ? 'F' : '$'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image Spécifique (Optionnel)
                  </label>
                  <input
                    type="url"
                    value={variantPrice?.image || ''}
                    onChange={e => handleVariantChange(combination, 'image', e.target.value)}
                    placeholder="URL de l'image (laissez vide pour utiliser l'image par défaut)"
                    className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  />
                </div>
              </div>

              {variantPrice?.image && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={variantPrice.image}
                    alt={`Variant ${combination.join(' - ')}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleVariantChange(combination, 'image', '')}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )}

  {/* Rest of the component remains the same */}