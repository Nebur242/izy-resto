import { AlertTriangle, CreditCard } from 'lucide-react';
import { Order } from '../../../types';
import { useSettings } from '../../../hooks/useSettings';
import { formatCurrency } from '../../../utils/currency';

interface OrderCardDetailsProps {
  order: Order;
}

export function OrderCardDetails({ order }: OrderCardDetailsProps) {
  const { settings } = useSettings();

  return (
    <>
      {/* Customer Details */}
      <div>
        <h4 className="font-medium mb-2">Détails client</h4>
        <div className="text-sm opacity-75 space-y-1">
          <p>{order.customerName}</p>
          <p>{order.customerPhone}</p>
          {order.customerEmail && <p>{order.customerEmail}</p>}
          {order.diningOption === 'delivery' && (
            <p className="font-medium">
              Adresse de livraison : {order.customerAddress}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      {order.paymentMethod && (
        <div className="border-t border-current/10 pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Mode de paiement
          </h4>
          <div className="text-sm opacity-75">
            <p>{order.paymentMethod.name}</p>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="border-t border-current/10 pt-4">
        <h4 className="font-medium mb-2">Produits commandés</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>
                {formatCurrency(item.price * item.quantity, settings?.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {order.preference && (
        <div className="border-t border-current/10 pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertTriangle /> Indications du client
          </h4>
          <p className="text-sm">{order.preference}</p>
        </div>
      )}
    </>
  );
}
