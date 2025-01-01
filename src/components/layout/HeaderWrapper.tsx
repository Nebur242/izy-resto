import React from 'react';
import { Header } from './Header';
import { ClassicHeader } from './ClassicHeader';
import { useSettings } from '../../hooks/useSettings';

export function HeaderWrapper() {
  const { settings } = useSettings();
  
  return settings?.activeHeader === 'classic' ? <ClassicHeader /> : <Header />;
}