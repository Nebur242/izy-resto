import { RestaurantSettings } from '../types/settings';

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Restaurant',
  description: 'Welcome to our restaurant',
  logo: '',
  logoWidth: 100,
  logoHeight: 100,
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  currency: 'USD',
  defaultTheme: 'dark',
  openingHours: {
    monday: { open: '11:00', close: '22:00', closed: false },
    tuesday: { open: '11:00', close: '22:00', closed: false },
    wednesday: { open: '11:00', close: '22:00', closed: false },
    thursday: { open: '11:00', close: '22:00', closed: false },
    friday: { open: '11:00', close: '23:00', closed: false },
    saturday: { open: '11:00', close: '23:00', closed: false },
    sunday: { open: '11:00', close: '22:00', closed: false }
  },
  address: '123 Restaurant Street',
  phone: '+1 234 567 890',
  activeLanding: 'modern',
  activeHeader: 'modern',
  socialMedia: [],
  seo: {
    title: 'Restaurant',
    favicon: '',
    description: 'Experience culinary excellence at our restaurant',
    keywords: ['restaurant', 'food', 'dining'],
    ogImage: '',
    twitterHandle: '',
    googleSiteVerification: ''
  }
};