import React from 'react';
import { MapPin, Phone, ArrowDown } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/Button';
import { OpeningHoursButton } from './OpeningHoursButton';

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
  isButton?: boolean;
}

function InfoCard({ icon: Icon, title, description, onClick, isButton }: InfoCardProps) {
  const Component = isButton ? 'button' : 'div';
  const baseClassName = "flex items-center gap-3 rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all dark:bg-white/10 dark:shadow-white/5 w-full";
  const className = isButton 
    ? `${baseClassName} hover:bg-white/95 dark:hover:bg-white/15 active:scale-[0.98]` 
    : baseClassName;

  return (
    <Component 
      onClick={onClick}
      className={className}
    >
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {description}
        </p>
      </div>
    </Component>
  );
}

export function Hero() {
  const { settings } = useSettings();

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[550px] w-full overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={settings?.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"}
          alt="Restaurant ambiance"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60" />
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full">
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-full flex-col justify-between py-8 sm:py-12">
          {/* Top Content */}
            <div className="flex flex-1 flex-col items-center justify-center text-center px-4 -mt-16">
              <h1 className="max-w-xl mx-auto mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:max-w-2xl">
                {settings?.name || 'Fine Dining Experience'}
              </h1>
              <p className="mb-8 max-w-md mx-auto text-base text-gray-300/90 sm:text-lg">
                {settings?.description || 'Experience culinary excellence with our carefully crafted menu featuring fresh ingredients and innovative recipes.'}
              </p>
<Button
  onClick={scrollToMenu}
  className="group relative rounded-full px-8 py-3 text-base font-medium transition-all hover:shadow-lg hover:opacity-90 sm:text-lg
    bg-gradient-to-r from-gray-200 to-white text-blue-600 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300
    dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-400 dark:text-white dark:hover:from-blue-600 dark:hover:to-blue-500"
>
  Voir le Menu
  <ArrowDown className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-y-1 group-hover:animate-bounce" />
</Button>
            </div>

            {/* Bottom Content - Info Cards */}
            <div className="space-y-2 px-4 sm:flex sm:space-y-0 sm:space-x-4 sm:px-6 max-w-4xl mx-auto w-full">
              <div className="sm:flex-1">
                <OpeningHoursButton />
              </div>
              <div className="sm:flex-1">
                <InfoCard 
                  icon={MapPin}
                  title="Adresse"
                  description={settings?.address || '123 Rue Gourmet'}
                />
              </div>
              <div className="sm:flex-1">
                <InfoCard 
                  icon={Phone}
                  title="Contact"
                  description={settings?.phone || 'Appelez-nous pour réserver'}
                  isButton
                  onClick={() => {
                    if (settings?.phone) {
                      window.location.href = `tel:${settings.phone}`;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}