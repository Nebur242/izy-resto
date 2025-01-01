import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { DatePicker } from '../../../ui/DatePicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '../../../../hooks/useIsMobile';

interface DateFilterProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export function DateFilter({ startDate, endDate, onDateChange }: DateFilterProps) {
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const isMobile = useIsMobile();

  const presets = [
    { label: "Aujourd'hui", days: 0 },
    { label: isMobile ? '7j' : '7 derniers jours', days: 7 },
    { label: isMobile ? '30j' : '30 derniers jours', days: 30 }
  ];

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    if (days > 0) {
      start.setDate(start.getDate() - days);
    } else {
      start.setHours(0, 0, 0, 0);
    }
    onDateChange(start, end);
  };

  return (
    <div className="w-full sm:w-auto relative">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Date Range Buttons */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          {presets.map(preset => (
            <Button
              key={preset.days}
              variant="secondary"
              size="sm"
              onClick={() => handlePresetClick(preset.days)}
              className="flex-1 sm:flex-initial text-xs sm:text-sm px-2 sm:px-3"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Date Pickers */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <div className="relative flex-1 sm:flex-initial">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsEndPickerOpen(false);
                setIsStartPickerOpen(true);
              }}
              className="w-full sm:w-[140px] justify-start text-xs sm:text-sm"
            >
              <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              {format(startDate, 'dd MMM yyyy', { locale: fr })}
            </Button>

            {/* Start Date Picker Portal */}
            {isStartPickerOpen && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 max-w-fit mx-auto">
                  <DatePicker
                    date={startDate}
                    onSelect={(date) => {
                      onDateChange(date, endDate);
                      setIsStartPickerOpen(false);
                    }}
                    isOpen={isStartPickerOpen}
                    onClose={() => setIsStartPickerOpen(false)}
                    position="center"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsStartPickerOpen(false)}
                    className="absolute top-2 right-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}
          </div>

          <span className="text-gray-500 dark:text-gray-400">à</span>

          <div className="relative flex-1 sm:flex-initial">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsStartPickerOpen(false);
                setIsEndPickerOpen(true);
              }}
              className="w-full sm:w-[140px] justify-start text-xs sm:text-sm"
            >
              <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              {format(endDate, 'dd MMM yyyy', { locale: fr })}
            </Button>

            {/* End Date Picker Portal */}
            {isEndPickerOpen && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 max-w-fit mx-auto">
                  <DatePicker
                    date={endDate}
                    onSelect={(date) => {
                      onDateChange(startDate, date);
                      setIsEndPickerOpen(false);
                    }}
                    isOpen={isEndPickerOpen}
                    onClose={() => setIsEndPickerOpen(false)}
                    position="center"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEndPickerOpen(false)}
                    className="absolute top-2 right-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}