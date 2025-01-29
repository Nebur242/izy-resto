import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  item: {
    id: string;
    icon: LucideIcon;
    label: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export function MenuItem({ item, isActive, onClick }: MenuItemProps) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3
        rounded-lg transition-colors relative
        ${
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          initial={false}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <item.icon className="w-5 h-5 relative z-10" />
      <span className="relative z-10">{item.label}</span>
    </motion.button>
  );
}
