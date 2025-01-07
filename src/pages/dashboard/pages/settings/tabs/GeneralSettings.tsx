import React from 'react';
import { Building2, Share2 } from 'lucide-react';
import { LogoUploader } from '../../../../../components/settings/LogoUploader';
import { useFormContext } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../types';
import { SocialMediaSettings } from './SocialMediaSettings';

export function GeneralSettings() {
  const { register, watch, setValue, formState } =
    useFormContext<RestaurantSettings>();

  // Mark form as dirty when images change
  const handleImageChange = (field: 'logo' | 'coverImage', value: string) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

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
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="XOF">XOF (FCFA)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <SocialMediaSettings />
    </div>
  );
}
