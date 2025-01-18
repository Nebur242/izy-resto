export interface BluetoothDevice {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  device: BluetoothLE;
}

export interface BluetoothLE extends Bluetooth {
  gatt?: {
    connect: () => Promise<any>;
    disconnect: () => void;
    connected: boolean;
  };
}