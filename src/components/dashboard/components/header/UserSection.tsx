import { NotificationBell } from '../../../../components/dashboard/notifications/NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { LogoutButton } from './LogoutButton';
import { UserInfo } from './UserInfo';
import { useAuth } from '../../../../context/AuthContext';

interface UserSectionProps {
  onLogout: () => void;
}

export function UserSection({ onLogout }: UserSectionProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <UserInfo />
      <NotificationBell />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LogoutButton onLogout={onLogout} />
      </div>
    </div>
  );
}