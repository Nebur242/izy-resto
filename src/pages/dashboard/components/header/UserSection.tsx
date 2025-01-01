import React from 'react';
import { useTranslation } from '../../../../i18n/useTranslation';
import { NotificationBell } from '../../../../components/dashboard/notifications/NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { LogoutButton } from './LogoutButton';
import { UserInfo } from './UserInfo';

interface UserSectionProps {
  onLogout: () => void;
}

export function UserSection({ onLogout }: UserSectionProps) {
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