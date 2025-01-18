import { Moon, Sun } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../i18n/useTranslation';

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
        <Moon
          size={20}
          title={t('common.darkMode')}
          className="text-gray-900 dark:text-white"
        />
      ) : (
        <Sun
          size={20}
          title={t('common.lightMode')}
          className="text-gray-900 dark:text-white"
        />
      )}
    </Button>
  );
}
