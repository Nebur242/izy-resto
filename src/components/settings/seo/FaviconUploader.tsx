import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { LogoUploader } from '../../settings/LogoUploader';

interface FaviconUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export function FaviconUploader({ value, onChange }: FaviconUploaderProps) {
  return (
    <LogoUploader
      value={value}
      onChange={onChange}
      label="Favicon"
      description="Format recommandé: ICO, PNG (32x32px ou 16x16px). Le fichier doit être carré."
    />
  );
}