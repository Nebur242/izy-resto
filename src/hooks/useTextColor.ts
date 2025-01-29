import { useEffect, useState } from 'react';
import { useSettings } from './useSettings';

const useTextColor = () => {
  const { settings } = useSettings();
  const [textColorClass, setTextColorClass] = useState<string>('text-blue-600');
  const [textDarkColorClass, setTextDarkColorClass] =
    useState<string>('text-blue-400');

  useEffect(() => {
    if (settings?.theme?.paletteColor?.colors[0]?.textPrimary) {
      const textPrimary = settings.theme.paletteColor.colors[0].textPrimary;
      setTextColorClass(textPrimary);
      setTextDarkColorClass(`dark:${textPrimary}`);
    }
  }, [settings]);

  return `${textColorClass} ${textDarkColorClass}`;
};

export default useTextColor;
