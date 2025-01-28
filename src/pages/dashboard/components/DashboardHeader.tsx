import { useTranslation } from '../../../i18n/useTranslation';
import { BackButton } from './header/BackButton';
import { UserSection } from './header/UserSection';

interface DashboardHeaderProps {
  onLogout: () => void;
  onMenuClick: VoidFunction;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border:gray-200 dark:border-gray-700">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
        </div>
        <UserSection onLogout={onLogout} />
      </div>
    </header>
  );
}
