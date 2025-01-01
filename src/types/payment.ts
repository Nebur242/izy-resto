export interface PaymentMethod {
  id: string;
  name: string;
  qrCode?: string;
  isDefault?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}