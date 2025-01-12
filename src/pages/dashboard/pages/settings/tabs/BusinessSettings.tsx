import { Clock, Globe, Truck } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../types';

export function BusinessSettings() {
  const { register, watch } = useFormContext<RestaurantSettings>();

  const canDeliver = watch('canDeliver');
  const canDineIn = watch('canDineIn');

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  const dayNames = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Contact & Emplacement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <input
              type="text"
              {...register('address', { required: true })}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              {...register('phone', { required: true })}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Horaires d'Ouverture</h2>
        </div>

        <div className="space-y-4">
          {days.map(day => (
            <div key={day} className="flex items-center space-x-4">
              <span className="w-32">
                {dayNames[day as keyof typeof dayNames]}
              </span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register(`openingHours.${day}.closed` as const)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span>Fermé</span>
              </label>
              {!watch(`openingHours.${day}.closed`) && (
                <>
                  <input
                    type="time"
                    {...register(`openingHours.${day}.open` as const)}
                    className="rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  />
                  <span>à</span>
                  <input
                    type="time"
                    {...register(`openingHours.${day}.close` as const)}
                    className="rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Activation de la livraison</h2>
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register(`canDeliver`)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span>{canDeliver ? 'Actif' : 'Inactif'}</span>
        </label>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">
            Activation du paiement surplace
          </h2>
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('canDineIn')}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span>{canDineIn ? 'Actif' : 'Inactif'}</span>
        </label>
      </section>
    </div>
  );
}
