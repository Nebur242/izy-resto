import { BluetoothDevice } from '../../types/bluetooth';

class BluetoothService {
  async requestDevice(): Promise<BluetoothDevice | null> {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth not supported');
      }

      const device = await navigator.bluetooth.requestDevice({
        // Accept all devices for maximum compatibility
        acceptAllDevices: true,
        optionalServices: ['generic_access']
      });

      return {
        id: device.id,
        name: device.name || 'Unknown Device',
        status: 'disconnected',
        device: device
      };
    } catch (error) {
      console.error('Error requesting Bluetooth device:', error);
      throw error;
    }
  }

  async connectDevice(device: BluetoothLE): Promise<void> {
    try {
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to device');
      }
      
      // Try to get the Generic Access service to verify connection
      await server.getPrimaryService('generic_access');
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  }

  async disconnectDevice(device: BluetoothLE): Promise<void> {
    try {
      if (device.gatt?.connected) {
        device.gatt.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting device:', error);
      throw error;
    }
  }
}

export const bluetoothService = new BluetoothService();