import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { motion } from 'framer-motion';

interface Asset {
  id: string;
  name: string;
  value: number;
  purchaseDate: string;
  depreciationRate: number;
  category: string;
}

export function AssetsManagement() {
  const { settings } = useSettings();
  const [assets, setAssets] = useState<Asset[]>([]);

  const calculateCurrentValue = (asset: Asset) => {
    const years = (new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (365 * 24 * 60 * 60 * 1000);
    const depreciation = asset.value * (asset.depreciationRate / 100) * years;
    return Math.max(0, asset.value - depreciation);
  };

  const totalAssetsValue = assets.reduce((sum, asset) => sum + calculateCurrentValue(asset), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Actifs Immobilisés</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Valeur totale: {formatCurrency(totalAssetsValue, settings?.currency)}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un Actif
        </Button>
      </div>

      <div className="grid gap-4">
        {assets.map((asset) => (
          <motion.div
            key={asset.id}
            layout
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{asset.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Acheté le {new Date(asset.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency(calculateCurrentValue(asset), settings?.currency)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Valeur initiale: {formatCurrency(asset.value, settings?.currency)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}