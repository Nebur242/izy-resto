import React from 'react';
import { LucideIcon } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../../types/settings';

interface ThemeOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: 'light' | 'dark';
  selected: boolean;
  onChange: (value: 'light' | 'dark') => void;
  register: UseFormRegister<RestaurantSettings>;
}

export function ThemeOption({
  icon: Icon,
  title,
  description,
  value,
  selected,
  onChange,
  register
}: ThemeOptionProps) {
  return (
    <div 
      className={`
        relative rounded-lg border-2 p-6 cursor-pointer transition-all
        ${selected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
        }
      `}
      onClick={() => onChange(value)}
    >
      <input
        type="radio"
        {...register('defaultTheme')}
        value={value}
        className="sr-only"
      />
      <div className="flex items-center gap-4">
        <div className={`p-3 ${value === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-lg shadow-md`}>
          <Icon className={`w-8 h-8 ${value === 'light' ? 'text-amber-500' : 'text-blue-400'}`} />
        </div>
        <div>
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}