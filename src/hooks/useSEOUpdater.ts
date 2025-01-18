import { useEffect } from 'react';

export function useSEOUpdater(title?: string, favicon?: string) {
  useEffect(() => {
    // Update page title
    if (title) {
      document.title = title;
    }

    // Update favicon
    if (favicon) {
      const linkElement = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (linkElement) {
        linkElement.href = favicon;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = favicon;
        document.head.appendChild(newLink);
      }
    }
  }, [title, favicon]);
}