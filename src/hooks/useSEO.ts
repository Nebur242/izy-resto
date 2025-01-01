import { useEffect } from 'react';
import { useSettings } from './useSettings';

export function useSEO() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings?.seo) return;

    // Update title
    if (settings.seo.title) {
      document.title = settings.seo.title;
    }

    // Update favicon
    if (settings.seo.favicon) {
      const linkElement = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (linkElement) {
        linkElement.href = settings.seo.favicon;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = settings.seo.favicon;
        document.head.appendChild(newLink);
      }
    }
  }, [settings?.seo]);
}