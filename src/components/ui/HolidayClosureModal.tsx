import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Palmtree, Clock, Settings } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRestaurantStatus } from '../../hooks/useRestaurantStatus';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const FRENCH_DAYS: Record<string, string> = {
  sunday: 'Dimanche',
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
};

export function HolidayClosureModal() {
  const { settings } = useSettings();
  const { isHoliday } = useRestaurantStatus();
  const location = useLocation();

  // Check if we're on a protected route
  const isProtectedRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/login';

  // Early return after hooks
  if (!isHoliday || isProtectedRoute) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Close Button */}
          {/* <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button> */}

          <div className="p-6">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Palmtree className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {settings?.name || 'Restaurant'} est fermé
              </h3>

              {settings?.holidayClosure?.reason && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {settings?.holidayClosure?.reason}
                </p>
              )}

              {settings?.holidayClosure?.startDate &&
                settings?.holidayClosure?.endDate && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Du{' '}
                        {format(
                          new Date(settings?.holidayClosure?.startDate),
                          'dd MMMM',
                          { locale: fr }
                        )}{' '}
                        au{' '}
                        {format(
                          new Date(settings?.holidayClosure?.endDate),
                          'dd MMMM yyyy',
                          { locale: fr }
                        )}
                      </span>
                    </div>
                  </div>
                )}

              {settings?.openingHours && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Clock className="w-4 h-4" />
                    <span>Réouverture aux horaires habituels</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <div className="space-y-1 text-sm px-10">
                {DAYS.map(day => {
                  const hours = settings?.openingHours?.[day];
                  return (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{FRENCH_DAYS[day]}</span>
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
            {/* Action */}
            {/* <div className="mt-6">
              <Button onClick={onClose} className="w-full">
                J'ai compris
              </Button>
            </div> */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
