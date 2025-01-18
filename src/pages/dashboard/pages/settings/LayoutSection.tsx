import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Layout } from 'lucide-react';
import { RestaurantSettings } from '../../../../types';

interface LayoutSectionProps {
  register: UseFormRegister<RestaurantSettings>;
  watch: UseFormWatch<RestaurantSettings>;
  setValue: (name: keyof RestaurantSettings, value: any) => void;
}

export function LayoutSection({ register, watch, setValue }: LayoutSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Layout className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold">Mise en Page</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modern Template */}
        <div 
          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
            watch('activeLanding') === 'modern'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
          }`}
          onClick={() => setValue('activeLanding', 'modern')}
        >
          <input
            type="radio"
            {...register('activeLanding')}
            value="modern"
            className="sr-only"
          />
          <div className="aspect-video mb-4 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60" 
              alt="Modern template"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-medium mb-1">Modern</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Design moderne avec une grande image d'en-tête
          </p>
        </div>

        {/* Minimal Template */}
        <div 
          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
            watch('activeLanding') === 'minimal'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
          }`}
          onClick={() => setValue('activeLanding', 'minimal')}
        >
          <input
            type="radio"
            {...register('activeLanding')}
            value="minimal"
            className="sr-only"
          />
          <div className="aspect-video mb-4 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=500&q=60" 
              alt="Minimal template"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-medium mb-1">Minimal</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Design épuré et minimaliste
          </p>
        </div>

        {/* Grid Template */}
        <div 
          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
            watch('activeLanding') === 'grid'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
          }`}
          onClick={() => setValue('activeLanding', 'grid')}
        >
          <input
            type="radio"
            {...register('activeLanding')}
            value="grid"
            className="sr-only"
          />
          <div className="aspect-video mb-4 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=60" 
              alt="Grid template"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-medium mb-1">Grid</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mise en page en grille avec images
          </p>
        </div>
      </div>
    </section>
  );
}