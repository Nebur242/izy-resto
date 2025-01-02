export interface PaymentMethod {
  id: string;
  name: string;
  qrCode?: string;
  isDefault?: boolean;
  url?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
