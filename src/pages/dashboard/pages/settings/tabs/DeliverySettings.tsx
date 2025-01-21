import React from 'react';
import { Truck, Plus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
  RestaurantSettings,
  DeliveryZone,
} from '../../../../../types/settings';
import { Button } from '../../../../../components/ui/Button';
// import { DeliveryZoneList } from '../../../../../components/dashboard/components/delivery/DeliveryZoneList';
import { ConfirmDialog } from '../../../../../components/ui/ConfirmDialog';
import { DeliveryZoneForm } from '../../../components/delivery/DeliveryZoneForm';
import { DeliveryZoneList } from '../../../components/delivery/DeliveryZoneList';

export function DeliverySettings() {
  const { watch, setValue, register } = useFormContext<RestaurantSettings>();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingZone, setEditingZone] = React.useState<DeliveryZone | null>(
    null
  );
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{
    isOpen: boolean;
    zone: DeliveryZone | null;
  }>({ isOpen: false, zone: null });

  const deliveryEnabled = watch('delivery.enabled');
  const zones = watch('delivery.zones') || [];
  const currency = watch('currency');

  const handleSave = (data: Omit<DeliveryZone, 'id'>) => {
    const newZones = editingZone
      ? zones.map(zone =>
          zone.id === editingZone.id ? { ...zone, ...data } : zone
        )
      : [...zones, { ...data, id: crypto.randomUUID() }];

    setValue('delivery.zones', newZones, { shouldDirty: true });
    setIsFormOpen(false);
    setEditingZone(null);
  };

  const handleDelete = () => {
    if (!deleteConfirmation.zone) return;

    const newZones = zones.filter(
      zone => zone.id !== deleteConfirmation.zone?.id
    );
    setValue('delivery.zones', newZones, { shouldDirty: true });
    setDeleteConfirmation({ isOpen: false, zone: null });
  };

  return (
    <div className="space-y-8">
      {/* Enable/Disable Delivery */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Livraison</h2>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('delivery.enabled')}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label className="text-sm font-medium">Activer la livraison</label>
        </div>
      </section>

      {/* Delivery Zones */}
      {deliveryEnabled && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Zones de Livraison</h3>
            <Button type="button" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une zone
            </Button>
          </div>

          <DeliveryZoneList
            zones={zones}
            isLoading={false}
            currency={currency}
            onEdit={zone => {
              setEditingZone(zone);
              setIsFormOpen(true);
            }}
            onDelete={zone =>
              setDeleteConfirmation({
                isOpen: true,
                zone,
              })
            }
          />
        </section>
      )}

      {/* Forms and Modals */}
      {isFormOpen && (
        <DeliveryZoneForm
          zone={editingZone}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingZone(null);
          }}
          currency={currency}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        title="Supprimer la zone"
        message={`Êtes-vous sûr de vouloir supprimer la zone "${deleteConfirmation.zone?.name}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmation({ isOpen: false, zone: null })}
      />
    </div>
  );
}
