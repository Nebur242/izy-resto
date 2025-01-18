import { Building2, Shield } from 'lucide-react';
import { LogoUploader } from '../../../../../components/settings/LogoUploader';
import { useFormContext } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../types';
import { SocialMediaSettings } from './SocialMediaSettings';
import { allCurrencies } from '../../../../../constants/defaultSettings';

export function GeneralSettings() {
  const { register, watch, setValue } = useFormContext<RestaurantSettings>();

  // Mark form as dirty when images change
  const handleImageChange = (field: 'logo' | 'coverImage', value: string) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const currency = watch('currency');
  const currencyObject = allCurrencies.find(cur => cur.value === currency);

  return (
    <div className="space-y-8">
      {/* Basic Info Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Informations Générales</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom du Restaurant
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register('description', { required: true })}
              rows={3}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              {...register('email')}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <LogoUploader
              value={watch('logo')}
              onChange={url => handleImageChange('logo', url)}
            />
          </div>

          <div>
            <LogoUploader
              value={watch('coverImage')}
              onChange={url => handleImageChange('coverImage', url)}
              label="Image de Couverture"
              description="Format recommandé: JPG ou PNG en haute résolution (1920x1080px minimum)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Devise</label>
            <select
              {...register('currency')}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            >
              {allCurrencies.map(currency => (
                <option value={currency.value}>{currency.label}</option>
              ))}
            </select>
            {currencyObject?.infos && (
              <div
                className="flex mt-4 items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>{currencyObject.infos}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Limites de commande</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre maximum de commandes
            </label>
            <input
              type="number"
              {...register('rateLimits.maxOrders')}
              min="1"
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
            <p className="mt-1 text-sm text-gray-500">
              Nombre maximum de commandes par période
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Période (en heures)
            </label>
            <input
              type="number"
              {...register('rateLimits.timeWindowHours')}
              min="1"
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
            <p className="mt-1 text-sm text-gray-500">
              Durée de la période de limitation
            </p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <SocialMediaSettings />
    </div>
  );
}
