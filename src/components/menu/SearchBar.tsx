import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { useSettings } from '../../hooks';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  console.log(settings, 'settings');

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Lancer une recherche..."
          className={`w-full pl-12 pr-10 py-3 rounded-full border border-gray-200 dark:border-gray-700 
                   bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                   focus:outline-none focus:ring-2 focus:${
                     settings?.theme?.paletteColor?.colors[0]?.focusClass ||
                     'ring-blue-500'
                   }  dark:focus:${
            settings?.theme?.paletteColor?.colors[0]?.focusClass ||
            'ring-blue-400'
          } 
                   shadow-sm hover:shadow-md transition-shadow`}
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, translateY: '-50%' }}
              animate={{ opacity: 1, scale: 1, translateY: '-50%' }}
              exit={{ opacity: 0, scale: 0.5, translateY: '-50%' }}
              onClick={clearSearch}
              className="absolute right-4 top-[50%] -translate-y-[50%] p-1 rounded-full 
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
