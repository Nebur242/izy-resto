import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enDashboardTranslation from './locales/en/dashboard.json';
import frDashboardTranslation from './locales/fr/dashboard.json';

import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';

import frMenu from './locales/fr/menu.json';
import enMenu from './locales/en/menu.json';

const lng = localStorage.getItem('language') || 'fr';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      dashboard: enDashboardTranslation,
      menu: enMenu,
    },
    fr: {
      common: frCommon,
      dashboard: frDashboardTranslation,
      menu: frMenu,
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
