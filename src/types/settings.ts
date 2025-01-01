import { HeaderStyle, LandingTemplate } from './theme';

export interface SocialMediaProfile {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  url: string;
  active: boolean;
}

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
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  coverImage: string;
  currency: 'USD' | 'EUR' | 'XOF';
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
}