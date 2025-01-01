export interface RestaurantSettings {
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  currency: 'USD' | 'EUR' | 'XOF';
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