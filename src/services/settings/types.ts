import { Currency } from '../../types';

export interface RestaurantSettings {
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  currency: Currency;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  address: string;
  phone: string;
}
