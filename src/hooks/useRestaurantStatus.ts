import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';

export function useRestaurantStatus() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkRestaurantStatus();
    // Check every minute
    const interval = setInterval(checkRestaurantStatus, 60000);
    return () => clearInterval(interval);
  }, [settings]);

  const checkRestaurantStatus = () => {
    if (
      !settings?.openingHours ||
      !settings?.openingHours?.timezone ||
      !settings.hasOpeningHours
    )
      return;

    const now = new Date();
    const restaurantTime = new Date(
      now.toLocaleString('en-US', {
        timeZone: settings.openingHours.timezone,
      })
    );

    const currentDay = restaurantTime.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: settings.openingHours.timezone,
    }) as keyof typeof settings.openingHours;

    const todaySchedule =
      settings.openingHours[currentDay.toString().toLowerCase()];

    if (todaySchedule.closed) {
      setIsOpen(false);
      setShowModal(true);
      return;
    }

    const currentHour = restaurantTime.getHours();
    const currentMinutes = restaurantTime.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;

    const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
    const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number);

    const openingTime = openHour * 60 + openMinute;
    const closingTime = (closeHour === 0 ? 24 : closeHour) * 60 + closeMinute;

    const restaurantIsOpen =
      currentTime >= openingTime && currentTime < closingTime;

    setIsOpen(restaurantIsOpen);
    setShowModal(!restaurantIsOpen);
  };

  return {
    isOpen,
    showModal,
    closeModal: () => setShowModal(false),
  };
}
