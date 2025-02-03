import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

import enDashboardTranslation from './locales/en/dashboard.json';
import frDashboardTranslation from './locales/fr/dashboard.json';

import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';

const lng = localStorage.getItem('language') || 'fr';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
      dashboard: enDashboardTranslation,
      common: enCommon,
    },
    fr: {
      translation: frTranslation,
      dashboard: frDashboardTranslation,
      common: frCommon,
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
