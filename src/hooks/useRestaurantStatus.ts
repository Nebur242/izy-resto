import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';

export function useRestaurantStatus() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    checkRestaurantStatus();
    // Check every minute
    const interval = setInterval(checkRestaurantStatus, 60000);
    return () => clearInterval(interval);
  }, [settings]);

  const getDateInRestaurantTimezone = (date: Date, timeZone: string): Date => {
    return new Date(date.toLocaleString('en-US', { timeZone }));
  };

  const checkHolidayClosure = (
    restaurantTime: Date,
    timezone: string
  ): boolean => {
    if (
      !settings?.holidayClosure?.enabled ||
      !settings?.holidayClosure?.startDate ||
      !settings?.holidayClosure?.endDate ||
      !settings?.openingHours?.timezone
    ) {
      return false;
    }

    const startDate = new Date(settings.holidayClosure.startDate);
    const endDate = new Date(settings.holidayClosure.endDate);

    // Set time to start of day for start date and end of day for end date
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const startInTimezone = getDateInRestaurantTimezone(
      startDateTime,
      timezone
    );
    const endInTimezone = getDateInRestaurantTimezone(endDateTime, timezone);

    return restaurantTime >= startInTimezone && restaurantTime <= endInTimezone;
  };

  const parseTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const normalizeTime = (minutes: number): number => {
    // Handle times past midnight by adding 24 hours worth of minutes
    return minutes < 0 ? minutes + 24 * 60 : minutes;
  };

  const checkRestaurantStatus = () => {
    if (!settings?.openingHours?.timezone || !settings.hasOpeningHours) {
      return;
    }

    const timezone = settings.openingHours.timezone;
    const now = new Date();
    const restaurantTime = getDateInRestaurantTimezone(now, timezone);

    // Check holiday closure first
    if (checkHolidayClosure(restaurantTime, timezone)) {
      setIsOpen(false);
      setIsHoliday(true);
      setShowModal(true);
      return;
    }

    setIsHoliday(false);

    // Get current and previous day
    const currentDay = restaurantTime
      .toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: timezone,
      })
      .toLowerCase() as keyof typeof settings.openingHours;

    const previousDay = new Date(restaurantTime);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayName = previousDay
      .toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: timezone,
      })
      .toLowerCase() as keyof typeof settings.openingHours;

    const todaySchedule = settings.openingHours[currentDay];
    const previousDaySchedule = settings.openingHours[previousDayName];

    if (todaySchedule.closed && previousDaySchedule.closed) {
      setIsOpen(false);
      setShowModal(true);
      return;
    }

    const currentHour = restaurantTime.getHours();
    const currentMinutes = restaurantTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    let restaurantIsOpen = false;

    // Check if we're still in previous day's opening period (for times after midnight)
    if (!previousDaySchedule.closed) {
      const prevDayOpenTime = parseTimeToMinutes(previousDaySchedule.open);
      const prevDayCloseTime = parseTimeToMinutes(previousDaySchedule.close);

      if (prevDayCloseTime < prevDayOpenTime) {
        // Previous day's closing time is after midnight
        const normalizedCurrentTime = normalizeTime(currentTimeInMinutes);
        const normalizedCloseTime = normalizeTime(prevDayCloseTime);

        if (normalizedCurrentTime < normalizedCloseTime) {
          restaurantIsOpen = true;
        }
      }
    }

    // Check current day's schedule if we're not open from previous day
    if (!restaurantIsOpen && !todaySchedule.closed) {
      const openingTime = parseTimeToMinutes(todaySchedule.open);
      const closingTime = parseTimeToMinutes(todaySchedule.close);

      if (closingTime < openingTime) {
        // Closing time is after midnight
        restaurantIsOpen = currentTimeInMinutes >= openingTime;
      } else {
        // Normal same-day schedule
        restaurantIsOpen =
          currentTimeInMinutes >= openingTime &&
          currentTimeInMinutes < closingTime;
      }
    }

    setIsOpen(restaurantIsOpen);
    setShowModal(!restaurantIsOpen);
  };

  return {
    isOpen,
    showModal,
    isHoliday,
    closeModal: () => setShowModal(false),
  };
}
