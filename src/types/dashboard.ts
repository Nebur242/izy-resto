import { LucideIcon } from 'lucide-react';

export interface DashboardMenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  requiresAdmin?: boolean;
  mobileVisible?: boolean;
}