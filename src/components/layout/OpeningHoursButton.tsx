import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { OpeningHoursModal } from './OpeningHoursModal';
import { useSettings } from '../../hooks/useSettings';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function OpeningHoursButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings } = useSettings();

  // Get today's hours
  const today = DAYS[new Date().getDay()];
  const todayHours = settings?.openingHours?.[today];

  // Only show hours if they are set
  const hoursText = todayHours?.closed 
    ? "Fermé aujourd'hui"
    : todayHours?.open && todayHours?.close 
      ? `${todayHours.open} - ${todayHours.close}`
      : "Horaires non définis";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white/95 dark:bg-white/10 dark:shadow-white/5 dark:hover:bg-white/15"
      >
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Heures d'ouverture
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {hoursText}
          </p>
        </div>
      </button>

      <OpeningHoursModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}