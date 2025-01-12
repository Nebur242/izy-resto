import { useEffect } from 'react';
import { Clock, Globe, Truck } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const ErrorAlert = ({ message }: { message: string }) => (
  <div
    className=" border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <span className="block sm:inline">{message}</span>
  </div>
);

export function BusinessSettings() {
  const {
    register,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  const canDeliver = watch('canDeliver');
  const canDineIn = watch('canDineIn');

  // Validate that at least one option is selected
  useEffect(() => {
    if (!canDeliver && !canDineIn) {
      setError('serviceOptions', {
        type: 'custom',
        message: 'Au moins une option de service doit être activée',
      });
    } else {
      clearErrors('serviceOptions');
    }
  }, [canDeliver, canDineIn, setError, clearErrors]);

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
      {errors.serviceOptions && (
        <ErrorAlert message={errors.serviceOptions.message} />
      )}

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
              <span className="w-32">{dayNames[day]}</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register(`openingHours.${day}.closed`)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span>Fermé</span>
              </label>
              {!watch(`openingHours.${day}.closed`) && (
                <>
                  <input
                    type="time"
                    {...register(`openingHours.${day}.open`)}
                    className="rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  />
                  <span>à</span>
                  <input
                    type="time"
                    {...register(`openingHours.${day}.close`)}
                    className="rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Service Options */}
      <div className="space-y-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-medium text-lg">Options de Service</h3>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('canDeliver')}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span>Livraison {canDeliver ? '(Actif)' : '(Inactif)'}</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('canDineIn')}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span>
                Paiement sur place {canDineIn ? '(Actif)' : '(Inactif)'}
              </span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BusinessSettings;
