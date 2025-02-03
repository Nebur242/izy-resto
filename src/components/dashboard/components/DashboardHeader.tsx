import { Menu } from 'lucide-react';
import { Button } from '../../ui/Button';
import { BackButton } from './header/BackButton';
import { UserSection } from './header/UserSection';

interface DashboardHeaderProps {
  onLogout: () => void;
  onMenuClick: () => void;
}

export function DashboardHeader({
  onLogout,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border:gray-200 dark:border-gray-700">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <BackButton />
        </div>
        <UserSection onLogout={onLogout} />
      </div>
    </header>
  );
}
