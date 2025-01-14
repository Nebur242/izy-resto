import { RestaurantSettings } from '../types/settings';

export const API_URI = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/v1'
  : 'https://restaurants-project-backend-solitary-brook-2574.fly.dev/api/v1';

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Restaurant',
  description: 'Welcome to our restaurant',
  logo: '',
  logoWidth: 100,
  logoHeight: 100,
  coverImage:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  currency: 'XOF',
  defaultTheme: 'dark',
  hasOpeningHours: false,
  openingHours: {
    monday: { open: '11:00', close: '22:00', closed: false },
    tuesday: { open: '11:00', close: '22:00', closed: false },
    wednesday: { open: '11:00', close: '22:00', closed: false },
    thursday: { open: '11:00', close: '22:00', closed: false },
    friday: { open: '11:00', close: '23:00', closed: false },
    saturday: { open: '11:00', close: '23:00', closed: false },
    sunday: { open: '11:00', close: '22:00', closed: false },
  },
  address: '123 Restaurant Street',
  phone: '+1 234 567 890',
  activeLanding: 'modern',
  activeHeader: 'classic',
  socialMedia: [],
  seo: {
    title: 'Restaurant',
    favicon: '',
    description: 'Experience culinary excellence at our restaurant',
    keywords: ['restaurant', 'food', 'dining'],
    ogImage: '',
    twitterHandle: '',
    googleSiteVerification: '',
  },
  email: '',
  canDeliver: true,
  canDineIn: true,
  rateLimits: {
    maxOrders: 2,
    timeWindowHours: 1,
  },
};

const defaultCurrencyInfo =
  "Cette devise n'est pas encore supportée par les système de paiement: Wave, Paytech, CinetPay, Stripe";

type AllCurrency = {
  label: string;
  value: string;
  infos: string;
  display: string;
  acceptedPaymentMethods: ('PayTech' | 'Wave' | 'Stripe' | 'CinetPay')[];
};

export const allCurrencies: AllCurrency[] = [
  {
    label: 'XOF (FCFA)',
    value: 'XOF',
    display: 'FCFA',
    infos: '',
    acceptedPaymentMethods: ['PayTech', 'Wave', 'CinetPay'],
  },
  {
    label: 'XAF (FCFA)',
    value: 'XAF',
    display: 'FCFA',
    infos: '',
    acceptedPaymentMethods: ['PayTech', 'CinetPay'],
  },
  {
    label: 'CVE (CVE)',
    value: 'CVE',
    display: 'CVE',
    infos: '',
    acceptedPaymentMethods: ['PayTech', 'Wave'],
  },
  {
    label: 'MRU (UM)',
    value: 'UM',
    display: 'MRU',
    infos: defaultCurrencyInfo,
    acceptedPaymentMethods: [],
  },
  {
    label: 'MAD (DH)',
    value: 'MAD',
    display: 'DH',
    infos: '',
    acceptedPaymentMethods: ['PayTech', 'Stripe'],
  },
  {
    label: 'GMD (GMD)',
    value: 'GMD',
    display: 'GMD',
    infos: defaultCurrencyInfo,
    acceptedPaymentMethods: [],
  },

  {
    label: 'GOUD (HTG)',
    value: 'HTG',
    display: 'HTG',
    infos: defaultCurrencyInfo,
    acceptedPaymentMethods: [],
  },
  {
    label: 'Franc (GNF)',
    value: 'GNF',
    infos: '',
    display: 'GNF',
    acceptedPaymentMethods: ['CinetPay'],
  },
  {
    label: 'Franc (CDF)',
    value: 'CDF',
    display: 'CDF',
    infos: defaultCurrencyInfo,
    acceptedPaymentMethods: ['CinetPay'],
  },
  {
    label: 'USD ($)',
    value: 'USD',
    infos: '',
    display: 'USD',
    acceptedPaymentMethods: ['Stripe', 'PayTech'],
  },
  {
    label: 'EUR (€)',
    value: 'EUR',
    infos: '',
    display: '€',
    acceptedPaymentMethods: ['Stripe', 'PayTech'],
  },
  {
    label: 'CAD ($)',
    value: 'CAD',
    infos: '',
    display: '$',
    acceptedPaymentMethods: ['Stripe', 'PayTech'],
  },
  {
    label: 'GBP (£)',
    value: 'GBP',
    infos: '',
    display: 'GBP',
    acceptedPaymentMethods: ['Stripe'],
  },
  {
    label: 'RUB (₽)',
    value: 'RUB',
    infos: '',
    display: '₽',
    acceptedPaymentMethods: ['Stripe'],
  },
];

export const getCurrencyObject = (currency: string) => {
  return allCurrencies.find(
    curr => curr.value.toLowerCase() === currency.toLowerCase()
  );
};
