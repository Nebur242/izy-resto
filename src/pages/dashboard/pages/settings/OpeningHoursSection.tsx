import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { RestaurantSettings } from '../../../../types';

interface OpeningHoursSectionProps {
  register: UseFormRegister<RestaurantSettings>;
  watch: UseFormWatch<RestaurantSettings>;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function OpeningHoursSection({ register, watch }: OpeningHoursSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold">Horaires d'Ouverture</h2>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day} className="flex items-center space-x-4">
            <span className="w-32 capitalize">{day}</span>
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
  );
}