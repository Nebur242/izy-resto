import { Moon, Settings, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Logo } from './Logo';

interface HeaderProps {
  onDashboardOpen?: () => void;
}

export function Header({ onDashboardOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSettingsClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed left-0 right-0 top-0 z-50 
        transition-all duration-300 
        ${isScrolled ? 'bg-white dark:bg-gray-900/90' : 'bg-transparent'}
      `}
    >
      <Container>
        <div className="relative flex h-24 items-center">
          {/* Left Section - Theme Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`
                h-10 w-10 rounded-full p-0 
                ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                }
              `}
            >
              {theme === 'light' ? (
                <Moon size={24} className={isScrolled ? 'text-gray-900' : ''} />
              ) : (
                <Sun size={24} />
              )}
            </Button>
          </div>

          {/* Center Section - Logo & Name */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo isScrolled={isScrolled} />
          </div>

          {/* Right Section - Dashboard/Login */}
          <div className="ml-auto flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettingsClick}
              className={`
                ml-4 flex h-10 w-10 items-center justify-center rounded-full p-0 
                transition-colors 
                ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                }
              `}
            >
              <Settings
                size={24}
                className={isScrolled ? 'text-gray-900' : ''}
              />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
