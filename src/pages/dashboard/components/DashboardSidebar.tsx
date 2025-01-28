import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart,
  Calculator,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Image,
  Layers,
  LayoutDashboard,
  List,
  Package,
  QrCode,
  Settings,
  ShoppingBag,
  Store,
  Users,
  Users2,
  UtensilsCrossed,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../i18n/useTranslation';
import { RestaurantSettings } from '../../../types';
import { StaffMember } from '../../../types/staff';

interface DashboardSidebarProps {
  currentPage: string;
  isStaff: boolean;
  staffData: StaffMember | null;
  settings: RestaurantSettings | null;
  onClose: VoidFunction;
}

export function DashboardSidebar({
  currentPage,
  isStaff,
  settings,
  staffData,
}: DashboardSidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    // Core Operations
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'orders', icon: ShoppingBag, label: t('dashboard.orders') },
    { id: 'pos', icon: Store, label: t('dashboard.pos') },
    { id: 'traffic', icon: BarChart, label: 'Analyses' },

    // Menu Management
    { id: 'menu', icon: UtensilsCrossed, label: t('dashboard.menu') },
    { id: 'categories', icon: List, label: t('dashboard.categories') },
    { id: 'variants', icon: Layers, label: 'Variantes' },

    // Stock & Finance
    { id: 'inventory', icon: Package, label: 'Inventaire' },
    { id: 'payments', icon: CreditCard, label: 'Paiements' },
    { id: 'accounting', icon: Calculator, label: 'Comptabilité' },

    // Customer Relations
    { id: 'customers', icon: Users, label: t('customers.title') },
    { id: 'qr-code', icon: QrCode, label: 'QR Code' },

    // Administration
    { id: 'staff', icon: Users2, label: 'Personnel' },
    { id: 'media', icon: Image, label: 'Bibliothèque' },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className="relative bg-white dark:bg-gray-800 flex flex-col shadow-sm h-[calc(100vh-64px)] overflow-y-scroll"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-0 top-3 z-50 rounded-full border bg-white p-1.5 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Navigation */}
      <div className="overflow-y-scroll flex-1 overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <nav className="p-3 pt-8">
          {menuItems
            .filter(item => {
              if (!isStaff || staffData?.role === 'admin') return true;

              if (!staffData?.active) return false;

              return (
                settings?.staffPermissions.includes(item.id) &&
                item.id !== 'dashboard'
              );
            })
            .map(item => (
              <motion.div
                key={item.id}
                className="relative my-1"
                initial={false}
              >
                <motion.button
                  whileHover={{ x: isCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/dashboard/${item.id}`)}
                  className={`
                  w-full flex items-center space-x-3 
                  ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                  rounded-lg transition-colors relative group
                  ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                >
                  <div
                    className={`
                  relative z-10 flex items-center 
                  ${isCollapsed ? 'w-full justify-center' : ''}
                `}
                  >
                    <item.icon
                      className={`
                    relative z-10 transition-transform duration-200
                    ${isCollapsed ? 'w-6 h-6 group-hover:scale-110' : 'w-5 h-5'}
                  `}
                    />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 whitespace-nowrap overflow-hidden ml-3"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div
                    className="
                  absolute left-full top-1/2 -translate-y-1/2 ml-3 
                  bg-gray-800 text-white text-xs 
                  px-3 py-2 rounded-md 
                  opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  transition-all duration-200
                  pointer-events-none
                  z-50
                  shadow-lg
                "
                  >
                    {item.label}
                  </div>
                )}
              </motion.div>
            ))}
        </nav>
      </div>
    </motion.aside>
  );
}
