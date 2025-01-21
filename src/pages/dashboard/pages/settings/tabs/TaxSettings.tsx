import { useFieldArray, useFormContext } from 'react-hook-form';
import { Receipt, Coins, Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RestaurantSettings } from '../../../../../types/settings';
import { Button } from '../../../../../components/ui/Button';
import { useCategories } from '../../../../../hooks/useCategories';
import { KeywordsInput } from '../../../../../components/settings/seo/KeywordsInput';

// Category selection component

export function TaxSettings() {
  const { register, watch, control, setValue } =
    useFormContext<RestaurantSettings>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'taxes.rates',
  });

  const { categories } = useCategories();
  const taxEnabled = watch('taxes.enabled');
  const tipsEnabled = watch('tips.enabled');

  const CategorySelect = ({ index }: { index: number }) => {
    // const { watch, setValue } = useFormContext();
    const currentValue = watch(`taxes.rates.${index}.appliesTo`);

    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">S'applique à</label>
        <select
          value={currentValue}
          onChange={e =>
            setValue(`taxes.rates.${index}.appliesTo`, e.target.value, {
              shouldDirty: true, // This ensures the form knows a change has occurred
            })
          }
          className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
        >
          <option value="all">Tous les produits</option>
          {categories?.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleAddTax = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    append({
      id: crypto.randomUUID(),
      name: '',
      rate: 0,
      enabled: true,
      appliesTo: 'all',
      order: fields.length,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Update order values
    const updatedFields = [...fields];
    const [movedItem] = updatedFields.splice(sourceIndex, 1);
    updatedFields.splice(destinationIndex, 0, movedItem);

    // Update order property for each item
    updatedFields.forEach((field, index) => {
      setValue(`taxes.rates.${index}.order`, index);
    });

    move(sourceIndex, destinationIndex);
  };

  return (
    <div className="space-y-8">
      {/* Tax Settings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold">Taxes</h2>
          </div>
          {taxEnabled && (
            <Button onClick={handleAddTax}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une taxe
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('taxes.enabled')}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium">
              Activer la gestion des taxes
            </label>
          </div>

          {taxEnabled && (
            <>
              {/* <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  {...register('taxes.includedInPrice')}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label className="text-sm font-medium">
                  Les prix affichés incluent les taxes
                </label>
              </div> */}

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tax-rates">
                  {provided => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`
                                bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4
                                ${
                                  snapshot.isDragging
                                    ? 'shadow-lg ring-2 ring-blue-500'
                                    : ''
                                }
                              `}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move hover:text-blue-500 transition-colors"
                                >
                                  <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Nom de la taxe
                                    </label>
                                    <input
                                      type="text"
                                      {...register(`taxes.rates.${index}.name`)}
                                      placeholder="Ex: TVA"
                                      className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Taux (%)
                                    </label>
                                    <input
                                      type="number"
                                      step="0.001"
                                      min="0"
                                      max="100"
                                      {...register(`taxes.rates.${index}.rate`)}
                                      className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                                    />
                                  </div>

                                  <CategorySelect index={index} />

                                  <div className="md:col-span-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        {...register(
                                          `taxes.rates.${index}.enabled`
                                        )}
                                        className="rounded border-gray-300 dark:border-gray-600"
                                      />
                                      <label className="text-sm font-medium">
                                        Activer cette taxe
                                      </label>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      onClick={() => remove(index)}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
        </div>
      </section>

      {/* Tips Settings */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Pourboires</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('tips.enabled')}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium">
              Activer les pourboires
            </label>
          </div>

          {tipsEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {/* <input
                  type="text"
                  {...register('tips.defaultPercentages')}
                  placeholder="Ex: 5,10,15,20"
                  className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                /> */}
                <label className="block text-sm font-medium mb-1">
                  Pourcentages suggérés (séparés par des virgules)
                </label>
                <KeywordsInput
                  type="number"
                  value={watch('tips.defaultPercentages') || []}
                  onChange={keywords =>
                    setValue('tips.defaultPercentages', keywords, {
                      shouldDirty: true,
                    })
                  }
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ces pourcentages seront proposés comme options de pourboire
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Libellé du pourboire
                </label>
                <input
                  type="text"
                  {...register('tips.label')}
                  placeholder="Ex: Pourboire"
                  className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                />
              </div>

              {/* <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('tips.allowCustom')}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <label className="text-sm font-medium">
                    Autoriser les montants personnalisés
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Si activé, les clients pourront saisir un montant personnalisé
                </p>
              </div> */}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
