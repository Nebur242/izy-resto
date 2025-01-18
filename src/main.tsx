import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { settingsService } from './services/settings/settings.service';

// Initialize theme before rendering
const initializeTheme = async () => {
  try {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme-preference');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      return;
    }

    // If no localStorage theme, get from settings
    const settings = await settingsService.getSettings();
    const theme = settings?.defaultTheme || 'dark';

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (error) {
    // Fallback to dark theme if there's an error
    console.error('Error initializing theme:', error);
    document.documentElement.classList.add('dark');
  }
};

// Initialize theme then render app
initializeTheme().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <div className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 ">
          <App />
        </div>
      </BrowserRouter>
    </StrictMode>
  );
});
