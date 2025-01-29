import React from 'react';
import { useSettings } from '../../hooks';
import { useTranslation } from '../../i18n/useTranslation';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  translationKey?: string;
  spanClassName?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  translationKey,
  disabled,
  spanClassName = '',
  ...props
}: ButtonProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  // Définition des styles de base pour le bouton
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    dark:focus:ring-offset-gray-800
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  // Définition des styles par variante
  const variants = {
    primary: `
      ${settings?.theme?.paletteColor?.colors[0]?.class || 'bg-blue-500'}
      text-white
      hover:from-blue-300 hover:to-blue-200
      shadow-sm focus:ring-blue-500/50
      dark:${settings?.theme?.paletteColor?.colors[0]?.class || 'bg-blue-500'} 
      dark:hover:from-blue-600 dark:hover:to-blue-500
    `.trim(),

    secondary: `
      bg-white text-gray-700 border border-gray-200
      hover:bg-gray-50 hover:border-gray-300
      shadow-sm focus:ring-gray-500/50
      dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
      dark:hover:bg-gray-700 dark:hover:border-gray-600
    `.trim(),

    danger: `
      bg-gradient-to-r from-red-600 to-red-500 text-white
      hover:from-red-700 hover:to-red-600
      shadow-sm focus:ring-red-500/50
      dark:from-red-500 dark:to-red-400
      dark:hover:from-red-600 dark:hover:to-red-500
    `.trim(),

    ghost: `
      text-gray-600 hover:text-gray-900 hover:bg-gray-100
      focus:ring-gray-500/50
      dark:text-gray-400 dark:hover:text-gray-100
      dark:hover:bg-gray-800
    `.trim(),
  };

  // Définition des tailles du bouton
  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
  };

  // Détection si le bouton utilise un style dégradé
  const hasGradient = ['primary', 'danger'].includes(variant);
  const hoverOverlay = hasGradient ? (
    <span className="absolute inset-0 rounded-xl bg-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />
  ) : null;

  // Traduction du contenu ou affichage brut
  const content = translationKey ? t(translationKey) : children;

  return (
    <button
      className={`group ${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {hoverOverlay}
      <span className={`relative flex items-center ${spanClassName}`}>
        {content}
      </span>
    </button>
  );
}
