import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';

import enDashboardTranslation from './locales/en/dashboard.json';
import frDashboardTranslation from './locales/fr/dashboard.json';

// import enModernLandingPage from './locales/en/modern-landing.json';
// import frModernLandingPage from './locales/fr/modern-landing.json';

import enHero from './locales/en/hero.json';
import frHero from './locales/fr/hero.json';

const lng = localStorage.getItem('language') || 'fr';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      dashboard: enDashboardTranslation,
      // modernLanding: enModernLandingPage,
      hero: enHero,
    },
    fr: {
      common: frCommon,
      dashboard: frDashboardTranslation,
      // modernLanding: frModernLandingPage,
      hero: frHero,
    },
  },
  lng,
  fallbackLng: 'fr',
  saveMissing: true,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
