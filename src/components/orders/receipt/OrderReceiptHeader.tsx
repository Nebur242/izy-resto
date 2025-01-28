import { CheckCircle, XCircle } from 'lucide-react';
import { OrderStatus } from '../../../types';

interface OrderReceiptHeaderProps {
  status: OrderStatus;
}

export function OrderReceiptHeader({ status }: OrderReceiptHeaderProps) {
  const isCancelled = status === 'cancelled';

  return (
    <div
      className={`p-6 sm:p-8 text-white rounded-t-lg ${
        isCancelled ? 'bg-red-600' : 'bg-gradient-to-r from-emerald-500 to-green-600'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div
          className={`p-3 sm:p-4 rounded-full ${
            isCancelled ? 'bg-red-800' : 'bg-white/30'
          }`}
        >
          {isCancelled ? (
            <XCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          ) : (
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          )}
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold mb-2">
            {isCancelled ? 'Commande annulée' : 'Commande confirmée !'}
          </h1>
          <p className="text-white/80">
            {isCancelled
              ? 'Cette commande a été annulée'
              : 'Votre commande a été enregistrée avec succès'}
          </p>
        </div>
      </div>
    </div>
  );
}