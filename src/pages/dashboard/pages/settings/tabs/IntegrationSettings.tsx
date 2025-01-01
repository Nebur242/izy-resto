import React from 'react';
import { Webhook, Bluetooth, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../types';
import { Button } from '../../../../../components/ui/Button';
import { useBluetooth } from '../../../../../hooks/useBluetooth';

export function IntegrationSettings() {
  const { register } = useFormContext<RestaurantSettings>();
  const { 
    devices,
    isScanning,
    scanForDevices,
    connectDevice,
    disconnectDevice,
    removeDevice
  } = useBluetooth();

  return (
    <div className="space-y-8">
      {/* Bluetooth Devices Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bluetooth className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold">Appareils Bluetooth</h2>
          </div>
          <Button
            onClick={scanForDevices}
            disabled={isScanning}
            className="relative group"
          >
            {isScanning ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Recherche...
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4 mr-2" />
                Ajouter un appareil
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {devices.map(device => (
            <div
              key={device.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <Bluetooth className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">{device.name}</h3>
                  <p className="text-sm text-gray-500">
                    {device.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {device.status === 'disconnected' ? (
                  <Button
                    onClick={() => connectDevice(device.id)}
                    className="text-sm"
                  >
                    Connecter
                  </Button>
                ) : (
                  <Button
                    onClick={() => disconnectDevice(device.id)}
                    variant="secondary"
                    className="text-sm"
                  >
                    Déconnecter
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => removeDevice(device.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {devices.length === 0 && !isScanning && (
            <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Bluetooth className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun appareil Bluetooth connecté
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Cliquez sur "Ajouter un appareil" pour commencer
              </p>
            </div>
          )}
        </div>
      </section>

      {/* API Integration Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Webhook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">API & Webhooks</h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Les intégrations API et webhooks seront bientôt disponibles. Vous pourrez connecter votre restaurant à des services tiers pour améliorer votre expérience.
          </p>
        </div>
      </section>
    </div>
  );
}