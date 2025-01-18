import { useState, useCallback } from 'react';
import { BluetoothDevice } from '../types/bluetooth';
import { bluetoothService } from '../services/bluetooth/bluetooth.service';
import toast from 'react-hot-toast';

export function useBluetooth() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanForDevices = useCallback(async () => {
    try {
      setIsScanning(true);
      const device = await bluetoothService.requestDevice();
      
      if (device) {
        setDevices(prev => {
          // Check if device already exists
          const exists = prev.some(d => d.id === device.id);
          if (exists) {
            return prev;
          }
          return [...prev, device];
        });
        toast.success('Appareil trouvé');
      }
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        toast.error('Aucun appareil trouvé');
      } else if (error.name === 'SecurityError') {
        toast.error('Permission refusée');
      } else {
        toast.error('Erreur lors de la recherche');
      }
      console.error('Bluetooth scan error:', error);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const connectDevice = useCallback(async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      await bluetoothService.connectDevice(device.device);
      setDevices(prev => 
        prev.map(d => d.id === deviceId 
          ? { ...d, status: 'connected' } 
          : d
        )
      );
      toast.success(`${device.name} connecté`);
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Erreur de connexion');
    }
  }, [devices]);

  const disconnectDevice = useCallback(async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      await bluetoothService.disconnectDevice(device.device);
      setDevices(prev => 
        prev.map(d => d.id === deviceId 
          ? { ...d, status: 'disconnected' } 
          : d
        )
      );
      toast.success(`${device.name} déconnecté`);
    } catch (error) {
      console.error('Disconnection error:', error);
      toast.error('Erreur de déconnexion');
    }
  }, [devices]);

  const removeDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    toast.success('Appareil supprimé');
  }, []);

  return {
    devices,
    isScanning,
    scanForDevices,
    connectDevice,
    disconnectDevice,
    removeDevice
  };
}