import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Currency, DeliveryZone } from '../../../../types';
import { Button } from '../../../../components/ui';

interface DeliveryZoneFormProps {
  zone?: DeliveryZone | null;
  onSave: (data: Omit<DeliveryZone, 'id'>) => void;
  onCancel: () => void;
  currency?: Currency;
}

export function DeliveryZoneForm({
  zone,
  onSave,
  onCancel,
  currency,
}: DeliveryZoneFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<DeliveryZone, 'id'>>({
    defaultValues: zone || {
      name: '',
      description: '',
      price: 0,
      active: true,
    },
  });

  const onSubmit = (data: Omit<DeliveryZone, 'id'>) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {zone ? 'Modifier la zone' : 'Nouvelle zone de livraison'}
          </h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom de la zone
            </label>
            <input
              type="text"
              {...register('name', { required: 'Le nom est requis' })}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              placeholder="Ex: Centre-ville"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              placeholder="Description de la zone (optionnel)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Prix de livraison
            </label>
            <div className="relative">
              <input
                type="number"
                step={currency === 'XOF' ? '1' : '0.01'}
                {...register('price', {
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' },
                })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {currency}
              </span>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              {zone ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
