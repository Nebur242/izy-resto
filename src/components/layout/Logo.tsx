import { Utensils } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  isScrolled?: boolean;
}

export function Logo({ className = '', isScrolled = false }: LogoProps) {
  const { settings } = useSettings();
  
  if (settings?.logo) {
    return (
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={settings.logo}
        alt={settings?.name || 'Restaurant Logo'}
        className={`
          h-12 w-auto object-contain 
          ${isScrolled 
            ? 'text-gray-900 dark:text-white' 
            : 'text-white'
          } 
          ${className}
        `}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Utensils 
        className={`
          w-10 h-10 
          ${isScrolled 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-white'
          } 
          ${className}
        `}
      />
      {settings?.name && (
        <span 
          className={`
            text-xl font-bold 
            ${isScrolled 
              ? 'text-gray-900 dark:text-white' 
              : 'text-white'
            }
          `}
        >
          {settings.name}
        </span>
      )}
    </motion.div>
  );
}