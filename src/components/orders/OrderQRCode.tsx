import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IOrderQRCodeProps {
  orderId: string;
  size?: number;
}

export function OrderQRCode(props: IOrderQRCodeProps) {
  const { orderId, size = 200 } = props;
  const { t } = useTranslation('order');
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
        alt={t('scan-qr-code-to-track')}
        className="w-full h-full"
      />
      <p className="text-xs text-center mt-2 text-gray-500">
        {t('scan-qr-code-to-track')}
      </p>
    </motion.div>
  );
}
