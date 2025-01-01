import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../i18n/useTranslation';
import { Button } from '../../../../components/ui/Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full p-0"
    >
      {theme === 'light' ? (
        <Moon size={20} title={t('common.darkMode')} />
      ) : (
        <Sun size={20} title={t('common.lightMode')} />
      )}
    </Button>
  );
}