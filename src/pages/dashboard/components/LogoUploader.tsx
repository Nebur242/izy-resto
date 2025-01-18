import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface LogoUploaderProps {
  currentLogoUrl: string;
  currentLogoWidth?: number;
  currentLogoHeight?: number;
  onLogoChange: (url: string) => void;
  onLogoWidthChange: (width: number) => void;
  onLogoHeightChange: (height: number) => void;
}

export function LogoUploader({
  currentLogoUrl,
  currentLogoWidth = 100,
  currentLogoHeight = 100,
  onLogoChange,
  onLogoWidthChange,
  onLogoHeightChange,
}: LogoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogoUrl || '');
  const [logoWidth, setLogoWidth] = useState<number>(currentLogoWidth);
  const [logoHeight, setLogoHeight] = useState<number>(currentLogoHeight);

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onLogoChange(url);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10) || 0;
    setLogoWidth(width);
    onLogoWidthChange(width);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value, 10) || 0;
    setLogoHeight(height);
    onLogoHeightChange(height);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl('');
    onLogoChange('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Logo du Restaurant
      </label>

      <div className="space-y-2">
        <input
          type="text"
          className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
          placeholder="URL du logo (ex: https://example.com/logo.png)"
          value={previewUrl}
          onChange={handleLogoUrlChange}
        />

        {previewUrl && (
          <div className="flex items-center space-x-4">
            <div
              className="rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
              style={{
                width: `${logoWidth}px`,
                height: `${logoHeight}px`
              }}
            >
              <img
                src={previewUrl}
                alt="Aperçu du logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <Button type="button" variant="danger" onClick={handleRemoveLogo}>
              <X className="w-4 h-4 mr-2" />
              Supprimer le logo
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Largeur du logo (en px)
        </label>
        <input
          type="number"
          className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
          value={logoWidth}
          onChange={handleWidthChange}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Hauteur du logo (en px)
        </label>
        <input
          type="number"
          className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
          value={logoHeight}
          onChange={handleHeightChange}
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Recommandé : taille carrée (ex: 512x512px).  
        Formats supportés : PNG, JPG, SVG.
      </p>
    </div>
  );
}
