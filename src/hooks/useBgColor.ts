import { useEffect, useState } from 'react';
import { useSettings } from './useSettings';

const useBgColor = () => {
  const { settings } = useSettings();
  const [bgColorClass, setBgColorClass] = useState<string>('bg-blue-600');
  const [bgDarkColorClass, setBgDarkColorClass] =
    useState<string>('bg-blue-400');

  useEffect(() => {
    if (settings?.theme?.paletteColor?.colors[0]?.textPrimary) {
      const textPrimary = settings.theme.paletteColor.colors[0]?.textPrimary;
      setBgColorClass(textPrimary);
      setBgDarkColorClass(`dark:${textPrimary}`);
    }
  }, [settings]);

  return `${bgColorClass} ${bgDarkColorClass}`;
};

export default useBgColor;
