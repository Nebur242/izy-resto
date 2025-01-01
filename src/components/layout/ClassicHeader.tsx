import React from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { useSettings } from '../../hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';

export function ClassicHeader() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const { user } = useAuth();

  const handleSettingsClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Left Section - Theme Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="relative h-11 w-11 rounded-xl p-0 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
              ) : (
                <Sun className="h-5 w-5 transition-transform hover:rotate-12" />
              )}
            </Button>
          </div>

          {/* Center Section - Logo & Name */}
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>

          {/* Right Section - Dashboard/Login */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleSettingsClick}
              className="relative h-11 w-11 rounded-xl p-0 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
            >
              <Settings className="h-5 w-5 transition-transform hover:rotate-12" />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}