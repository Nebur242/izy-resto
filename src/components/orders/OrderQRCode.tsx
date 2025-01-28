import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';

interface OrderQRCodeProps {
  orderId: string;
  size?: number;
}

export function OrderQRCode({ orderId, size = 200 }: OrderQRCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [orderId, size]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      const trackingUrl = `${window.location.origin}/order/${orderId}`;

      const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });

      setQrUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <QrCode className="w-12 h-12 text-gray-300 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-4 shadow-lg"
    >
      <img
        src={qrUrl}
        alt="QR Code de suivi de commande"
        className="w-full h-full"
      />
      <p className="text-xs text-center mt-2 text-gray-500">
        Scannez pour suivre votre commande
      </p>
    </motion.div>
  );
}
