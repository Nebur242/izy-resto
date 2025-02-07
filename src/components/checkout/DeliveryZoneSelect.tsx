import { MapPin } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';
import { DeliveryZone } from '../../types';
import { useTranslation } from 'react-i18next';

interface DeliveryZoneSelectProps {
  selectedZone: DeliveryZone | null;
  onZoneChange: (zone: DeliveryZone) => void;
  className?: string;
}

export function DeliveryZoneSelect({
  selectedZone,
  onZoneChange,
  className = '',
}: DeliveryZoneSelectProps) {
  const { settings, isLoading } = useSettings();
  const { t } = useTranslation('order');

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-10 w-full" />
    );
  }

  const zones = settings?.delivery?.zones || [];

  if (zones.length === 0) {
    return (
      <div className="text-sm text-red-500 dark:text-red-400">
        {t('delivery-not-available')}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {t('delivery-zone')} *
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <select
          value={selectedZone?.id || ''}
          onChange={e => {
            const zone = zones.find(z => z.id === e.target.value);
            if (zone) onZoneChange(zone);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 appearance-none"
        >
          <option value="">{`${t('select-zone')}`}</option>
          {zones.map(zone => (
            <option key={zone.id} value={zone.id}>
              {zone.name} - {formatCurrency(zone.price, settings?.currency)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
