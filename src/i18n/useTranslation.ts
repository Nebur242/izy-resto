import { useCallback } from 'react';
import { fr } from './locales/fr';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

export function useTranslation() {
  const t = useCallback((key: TranslationKey, params?: TranslationParams) => {
    const keys = key.split('.');
    let value = keys.reduce((obj, key) => obj?.[key], fr as any);

    if (!value) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        value = value.replace(`{{${key}}}`, String(val));
      });
    }

    return value;
  }, []);

  return { t };
}