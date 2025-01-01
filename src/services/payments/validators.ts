import { PaymentMethod } from '../../types/payment';
import { PaymentServiceError } from './errors';

export async function validatePaymentMethod(data: Partial<PaymentMethod>): Promise<void> {
  if (!data.name?.trim()) {
    throw new PaymentServiceError(
      'Le nom de la méthode de paiement est requis',
      'payment/invalid-name'
    );
  }

  if (data.qrCode && !isValidUrl(data.qrCode)) {
    throw new PaymentServiceError(
      'URL du QR code invalide',
      'payment/invalid-qr-code'
    );
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}