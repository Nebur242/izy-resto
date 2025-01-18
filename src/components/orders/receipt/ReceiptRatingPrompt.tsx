import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';

interface ReceiptRatingPromptProps {
  orderId: string;
}

export function ReceiptRatingPrompt({ orderId }: ReceiptRatingPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg"
    >
      <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
      <h3 className="text-xl font-semibold mb-2">
        Votre avis compte !
      </h3>
      <p className="text-white/80 mb-4">
        Aidez-nous à améliorer notre service en notant votre commande
      </p>
      <Link to={`/order/${orderId}`}>
        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
          Noter ma commande
        </Button>
      </Link>
    </motion.div>
  );
}