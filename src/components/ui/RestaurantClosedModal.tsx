import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { Button } from './Button';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export function RestaurantClosedModal() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState<string | null>(null);
  const location = useLocation();

  // Check if we're on a protected route
  const isProtectedRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/login';

  useEffect(() => {
    // Don't run effect on protected routes
    if (isProtectedRoute) {
      setIsOpen(false);
      return;
    }

    const checkIfOpen = () => {
      if (!settings?.openingHours) return false;

      // Get user's local time
      const now = new Date();
      const userTimezoneOffset = now.getTimezoneOffset();

      // Convert user's time to restaurant's timezone (assuming restaurant time is in local time)
      const restaurantTime = new Date(
        now.getTime() - userTimezoneOffset * 60000
      );

      const day = DAYS[restaurantTime.getDay()];
      const hours = restaurantTime.getHours().toString().padStart(2, '0');
      const minutes = restaurantTime.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      const todayHours = settings.openingHours[day];

      if (todayHours?.closed) {
        // Find next open day
        const todayIndex = DAYS.indexOf(day);
        let nextOpenDay = null;
        let daysUntilOpen = 0;

        for (let i = 1; i <= 7; i++) {
          const nextIndex = (todayIndex + i) % 7;
          const nextDay = DAYS[nextIndex];
          if (!settings.openingHours[nextDay]?.closed) {
            nextOpenDay = nextDay;
            daysUntilOpen = i;
            break;
          }
        }

        if (nextOpenDay) {
          const nextDayHours = settings.openingHours[nextOpenDay];
          const nextDate = new Date(restaurantTime);
          nextDate.setDate(nextDate.getDate() + daysUntilOpen);

          const formattedDay = nextDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
          });
          const dayName =
            formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1);
          setNextOpenTime(`${dayName} à ${nextDayHours.open}`);
        }

        return true;
      }

      if (!todayHours?.open || !todayHours?.close) return false;

      // Parse opening hours
      const [openHour, openMinute] = todayHours.open.split(':').map(Number);
      const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);

      // Convert to minutes for easier comparison
      const openTime = openHour * 60 + openMinute;
      const closeTime = closeHour * 60 + closeMinute;
      const current = currentHour * 60 + currentMinute;

      // Handle cases where closing time is on the next day
      if (closeTime < openTime) {
        return current < openTime && current > closeTime;
      }

      return current < openTime || current > closeTime;
    };

    const updateModalState = () => {
      setIsOpen(checkIfOpen());
    };

    // Initial check
    updateModalState();

    // Check every minute
    const interval = setInterval(updateModalState, 60000);

    return () => clearInterval(interval);
  }, [settings, isProtectedRoute]);

  // Early return after hooks
  if (!isOpen || isProtectedRoute) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Nous sommes fermés</h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {nextOpenTime ? (
              <>Nous ouvrirons {nextOpenTime}</>
            ) : (
              <>Nous sommes actuellement fermés</>
            )}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              Horaires d'ouverture :
            </div>

            <div className="space-y-1 text-sm">
              {DAYS.map(day => {
                const hours = settings?.openingHours?.[day];
                return (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span>
                      {hours?.closed
                        ? 'Fermé'
                        : `${hours?.open || '--:--'} - ${
                            hours?.close || '--:--'
                          }`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 mt-2">
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Administration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
