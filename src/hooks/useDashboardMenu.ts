import { useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useStaffCheck } from './useStaffCheck';
import { DashboardMenuItem } from '../types/dashboard';
import { useIsMobile } from './useIsMobile';
import { 
  LayoutDashboard, 
  Store, 
  List, 
  Layers, 
  UtensilsCrossed,
  Package, 
  Calculator, 
  ShoppingBag, 
  Users, 
  Users2, 
  Image,
  QrCode, 
  Settings, 
  CreditCard,
  BarChart2
} from 'lucide-react';

export function useDashboardMenu() {
  const { t } = useTranslation();
  const { isStaff, staffData } = useStaffCheck();
  const isMobile = useIsMobile();

  const menuItems: DashboardMenuItem[] = useMemo(() => [
    // Core Operations
    { 
      id: '', 
      icon: LayoutDashboard, 
      label: t('dashboard.overview'), 
      mobileVisible: true 
    },
    { 
      id: 'orders', 
      icon: ShoppingBag, 
      label: t('dashboard.orders'), 
      mobileVisible: true 
    },
    { 
      id: 'pos', 
      icon: Store, 
      label: t('dashboard.pos'), 
      mobileVisible: false 
    },
    
    // Analytics & Reports
    { 
      id: 'traffic', 
      icon: BarChart2, 
      label: 'Analyses', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    
    // Menu Management
    { 
      id: 'menu', 
      icon: UtensilsCrossed, 
      label: t('dashboard.menu'), 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'categories', 
      icon: List, 
      label: t('dashboard.categories'), 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'variants', 
      icon: Layers, 
      label: 'Variantes', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    
    // Stock & Finance
    { 
      id: 'inventory', 
      icon: Package, 
      label: 'Inventaire', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'payments', 
      icon: CreditCard, 
      label: 'Paiements', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'accounting', 
      icon: Calculator, 
      label: 'Comptabilité', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    
    // Customer Relations
    { 
      id: 'customers', 
      icon: Users, 
      label: t('customers.title'), 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'qr-code', 
      icon: QrCode, 
      label: 'QR Code', 
      mobileVisible: false 
    },
    
    // Administration
    { 
      id: 'staff', 
      icon: Users2, 
      label: 'Personnel', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'media', 
      icon: Image, 
      label: 'Bibliothèque', 
      requiresAdmin: true, 
      mobileVisible: false 
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: t('dashboard.settings'), 
      requiresAdmin: true, 
      mobileVisible: false 
    }
  ], [t]);

  const visibleMenuItems = useMemo(() => {
    let items = menuItems;

    // Filter by mobile visibility
    if (isMobile) {
      items = items.filter(item => item.mobileVisible);
    }

    // Filter by permissions
    if (isStaff && staffData) {
      items = items.filter(item => {
        if (item.requiresAdmin) {
          return staffData.permissions.includes(item.id);
        }
        return true;
      });
    }

    return items;
  }, [isStaff, staffData, menuItems, isMobile]);

  return { menuItems, visibleMenuItems };
}