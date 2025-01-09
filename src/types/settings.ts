import { HeaderStyle, LandingTemplate } from './theme';

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
  openingHours: {
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
}
