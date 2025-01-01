// src/components/ui/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UtensilsCrossed,
  ChefHat,
  Coffee,
  Wine,
  Pizza,
  Soup
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LOADING_MESSAGES = [
  "Préparation de votre menu",
  "Mise en place de la table",
  "Chauffe des fourneaux",
  "Le chef arrive",
  "Dernières touches"
];

const ANIMATION_ELEMENTS = [
  {
    Icon: Pizza,
    position: { top: '20%', left: '15%' },
    animation: { y: [-8, 8], opacity: [0.3, 0.7], rotate: [-5, 5] },
    duration: 3.5,
    size: 28
  },
  {
    Icon: Coffee,
    position: { top: '35%', right: '18%' },
    animation: { y: [6, -6], opacity: [0.4, 0.8], rotate: [3, -3] },
    duration: 4,
    size: 24
  },
  {
    Icon: UtensilsCrossed,
    position: { top: '25%', right: '25%' },
    animation: { y: [-10, 10], opacity: [0.3, 0.6], scale: [0.95, 1.05] },
    duration: 4.5,
    size: 32
  }
];

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSettings();

  // Delay showing the loading screen to prevent flash
  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    if (isLoading) {
      showTimeout = setTimeout(() => setIsVisible(true), 200);
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(showTimeout);
  }, [isLoading]);

  // Rotate through messages
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
 <AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/30 via-transparent to-blue-50/30 dark:from-orange-900/10 dark:via-transparent dark:to-blue-900/10" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-slate-100/[0.02]" />
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Restaurant Logo */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative bg-gradient-to-tr from-white-500 to-grey-600 p-4 rounded-2xl shadow-lg"
        >
          {settings?.logo ? (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                filter: ["drop-shadow(0 0 4px rgba(255,116,31,0.5))", "drop-shadow(0 0 8px rgba(255,116,31,0.7))", "drop-shadow(0 0 4px rgba(255,116,31,0.5))"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="rounded-xl overflow-hidden"
            >
              <img
                src={settings.logo}
                alt="Restaurant Logo"
                className="w-8 h-8 object-contain"
              />
            </motion.div>
          ) : (
            <UtensilsCrossed className="w-8 h-8 text-white" />
          )}
        </motion.div>

        {/* Loading Bar */}
        <div className="w-56 flex flex-col items-center gap-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                x: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
              }}
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500"
            />
          </div>

          {/* Loading Message */}
          <div className="h-6 relative flex items-center justify-center min-w-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute flex items-center gap-1.5"
              >
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {LOADING_MESSAGES[messageIndex]}
                </span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="text-orange-500 dark:text-orange-400"
                >
                  ...
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Icons */}
      {ANIMATION_ELEMENTS.map(({ Icon, position, animation, duration, size }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            ...animation,
            scale: animation.scale || 1
          }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.15
          }}
          style={{
            position: 'absolute',
            ...position
          }}
          className="text-gray-400/40 dark:text-gray-500/40 filter drop-shadow-sm"
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
  );
}