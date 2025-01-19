import { HeaderStyle, LandingTemplate } from './theme';

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  enabled: boolean;
  appliesTo: 'all' | string; // all items or specific categories
  order: number; // For controlling calculation order
}

export interface SocialMediaProfile {
  platform:
    | 'facebook'
    | 'instagram'
    | 'twitter'
    | 'linkedin'
    | 'youtube'
    | 'tiktok'
    | 'whatsapp';
  url: string;
  active: boolean;
}

export type Currency =
  | 'USD'
  | 'EUR'
  | 'CAD'
  | 'MAD'
  | 'XOF'
  | 'XAF'
  | 'CDF'
  | 'UM';

export interface SEOSettings {
  title: string;
  favicon: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterHandle: string;
  googleSiteVerification?: string;
}

export interface PaletteColor {
  name: string;
  colors: Array<{
    name: string;
    hex: string;
    class: string;
    hoverClass: string;
    focusClass: string;
    borderClass: string;
    shadowClass: string;
    darkBgColor: string;
    textClass: string;
    textHover: string;
    textPrimary: string;
    textDark: string;
    textOpacity: string;
    textDarkOpacity: string;
    colorName: string;
    borderColor: string;
  }>;
}

export interface RestaurantSettings {
  name: string;
  description: string;
  email: string;
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  coverImage: string;
  currency: Currency;
  defaultTheme: 'light' | 'dark'; // Add defaultTheme
  hasOpeningHours: boolean;
  openingHours: {
    timezone: string; // Required timezone
  } & {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  address: string;
  phone: string;
  activeLanding: LandingTemplate;
  activeHeader: HeaderStyle;
  socialMedia: SocialMediaProfile[];
  seo: SEOSettings;
  canDeliver: boolean;
  canDineIn: boolean;
  paymentOnDineInActivated: boolean;
  rateLimits: {
    maxOrders: number;
    timeWindowHours: number;
  };
  termsOfService?: string;
  holidayClosure?: {
    enabled: boolean;
    startDate: string;
    endDate: string;
    reason?: string;
  };
  taxes: {
    enabled: boolean;
    includedInPrice: boolean;
    rates: TaxRate[];
  };
  tips: {
    enabled: boolean;
    defaultPercentages: string[];
    allowCustom: boolean;
    label: string;
  };
  theme: {
    paletteColor: PaletteColor;
  };
}
