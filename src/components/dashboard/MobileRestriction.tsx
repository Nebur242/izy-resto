import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function MobileRestriction() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg"
          >
            <Laptop className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Version Bureau Requise
          </h1>
          <p className="text-gray-400">
            Le tableau de bord n'est accessible que sur les appareils avec un écran plus large. 
            Veuillez utiliser une tablette ou un ordinateur pour accéder à cette section.
          </p>
        </div>

        <Link to="/">
          <Button variant="secondary" className="w-full my-10 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Restaurant
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}