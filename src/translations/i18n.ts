import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCart from './locales/en/cart.json';
import frCart from './locales/fr/cart.json';

import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';

import enDashboardTranslation from './locales/en/dashboard.json';
import frDashboardTranslation from './locales/fr/dashboard.json';

import enFooter from './locales/en/footer.json';
import frFooter from './locales/fr/footer.json';


import enHero from './locales/en/hero.json';
import frHero from './locales/fr/hero.json';

const lng = localStorage.getItem('language') || 'fr';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      cart: enCart,
      common: enCommon,
      dashboard: enDashboardTranslation,
      footer: enFooter,
      hero: enHero,
    },
    fr: {
      cart: frCart,
      common: frCommon,
      dashboard: frDashboardTranslation,
      footer: frFooter,
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
