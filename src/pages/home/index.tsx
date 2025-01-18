import { useCallback } from 'react';
import {
  LandingGrid,
  LandingMinimal,
  LandingModern,
} from '../../components/landing';
import { useSettings } from '../../hooks';

export const Home = () => {
  const { settings } = useSettings();
  // Select landing component based on settings
  const getLandingComponent = useCallback(() => {
    switch (settings?.activeLanding) {
      case 'minimal':
        return <LandingMinimal />;
      case 'grid':
        return <LandingGrid />;
      default:
        return <LandingModern />;
    }
  }, [settings]);

  return getLandingComponent();
};
