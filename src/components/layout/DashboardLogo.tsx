import React from 'react';
import { Logo } from './Logo';
import { useSettings } from '../../hooks/useSettings';

export function DashboardLogo() {
  const { settings } = useSettings();

  return (
    <div className="flex items-center space-x-3 p-4">
      <Logo size="md" className="text-blue-600 dark:text-blue-400" />
      <span className="text-xl font-semibold text-gray-900 dark:text-white truncate">
        {settings?.name || 'Dashboard'}
      </span>
    </div>
  );
}