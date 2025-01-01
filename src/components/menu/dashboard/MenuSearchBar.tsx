import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '../../../i18n/useTranslation';

interface MenuSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearchBar({ value, onChange }: MenuSearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={t('common.search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}