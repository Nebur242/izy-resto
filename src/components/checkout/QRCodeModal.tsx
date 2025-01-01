import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface QRCodeModalProps {
  qrCode: string;
  onClose: () => void;
}

export function QRCodeModal({ qrCode, onClose }: QRCodeModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={qrCode}
          alt="QR Code de paiement"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
}