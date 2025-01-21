import React from 'react';
import { User } from 'lucide-react';

interface CustomerInfo {
  name?: string;
  phone?: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

export function CustomerInfoForm({
  customerInfo,
  onChange,
}: CustomerInfoFormProps) {
  return (
    <div className="space-y-4">
      {/* <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium">Informations Client (Optionnel)</h3>
      </div> */}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={customerInfo.name || ''}
            onChange={e => onChange({ ...customerInfo, name: e.target.value })}
            placeholder="Nom du client"
            className="w-full rounded-lg border dark:border-gray-700 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            type="tel"
            value={customerInfo.phone || ''}
            onChange={e => onChange({ ...customerInfo, phone: e.target.value })}
            placeholder="Numéro de téléphone"
            className="w-full rounded-lg border dark:border-gray-700 p-2"
          />
        </div>
      </div>
    </div>
  );
}
