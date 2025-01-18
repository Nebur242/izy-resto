import { LogOut } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useTranslation } from '../../../../i18n/useTranslation';

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { t } = useTranslation();

  return (
    <Button variant="secondary" size="sm" onClick={onLogout}>
      <LogOut className="w-4 h-4 mr-2 text-gray-900 dark:text-white" />
      {t('common.logout')}
    </Button>
  );
}
