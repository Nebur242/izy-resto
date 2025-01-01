import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Building2 } from 'lucide-react';
import { RestaurantSettings } from '../../../../types';
import { LogoUploader } from '../../../../components/settings/LogoUploader';

interface BasicInfoSectionProps {
  register: UseFormRegister<RestaurantSettings>;
  watch: UseFormWatch<RestaurantSettings>;
  setValue: (name: keyof RestaurantSettings, value: any) => void;
}

export function BasicInfoSection({ register, watch, setValue }: BasicInfoSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold">Informations du Restaurant</h2>
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
          <LogoUploader
            value={watch('logo')}
            onChange={(url) => setValue('logo', url)}
          />
        </div>

        <div>
          <LogoUploader
            value={watch('coverImage')}
            onChange={(url) => setValue('coverImage', url)}
            label="Image de Couverture"
            description="Format recommandé: JPG ou PNG en haute résolution (1920x1080px minimum)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Devise
          </label>
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
  );
}