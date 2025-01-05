export interface PaymentMethod {
  id: string;
  name: string;
  qrCode?: string;
  isDefault?: boolean;
  url?: string;
  apiKey?: string;
  apiSecret?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
