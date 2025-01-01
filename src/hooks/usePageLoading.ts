import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';

export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();
  const location = useLocation();
  const [hasShownInitialLoad, setHasShownInitialLoad] = useLocalStorage('hasShownInitialLoad', false);
  const [initialDashboardLoad, setInitialDashboardLoad] = useLocalStorage('initialDashboardLoad', true);

  useEffect(() => {
    if (!authLoading) {
      // Check if this is a dashboard route
      const isDashboardRoute = location.pathname.startsWith('/dashboard');

      if (isDashboardRoute) {
        if (initialDashboardLoad) {
          // Show loading only on first dashboard visit
          const timer = setTimeout(() => {
            setIsLoading(false);
            setInitialDashboardLoad(false);
          }, 1500);
          return () => clearTimeout(timer);
        } else {
          // No loading for subsequent dashboard navigation
          setIsLoading(false);
        }
      } else {
        // For non-dashboard routes
        if (!hasShownInitialLoad) {
          // Show loading for first visit
          const timer = setTimeout(() => {
            setIsLoading(false);
            setHasShownInitialLoad(true);
          }, 1500);
          return () => clearTimeout(timer);
        } else {
          // No loading for subsequent visits
          setIsLoading(false);
        }
      }
    }
  }, [authLoading, location.pathname, hasShownInitialLoad, initialDashboardLoad, setHasShownInitialLoad, setInitialDashboardLoad]);

  return { 
    isLoading: isLoading || authLoading
  };
}