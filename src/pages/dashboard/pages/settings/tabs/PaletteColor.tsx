import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSettings } from '../../../../../hooks';
import {
  RestaurantSettings,
  PaletteColor as typePaletteColor,
} from '../../../../../types';
import { colorPalettes } from '../../../../../utils/colorPalettes';

function PaletteColor() {
  const { settings } = useSettings();
  const { setValue } = useFormContext<RestaurantSettings>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const defaultTheme = useMemo(() => colorPalettes[0], []);
  const [selectedPalette, setSelectedPalette] = useState(defaultTheme);

  const { displayedPalettes, totalPages } = useMemo(() => {
    const total = Math.ceil(colorPalettes.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      displayedPalettes: colorPalettes.slice(start, end),
      totalPages: total,
    };
  }, [currentPage]);

  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(prev => prev - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(prev => prev + 1);

  const handlePaletteColorChange = (palette: typePaletteColor) => {
    setSelectedPalette(palette);
    setValue('theme.paletteColor', palette, { shouldDirty: true });
  };

  const resetToDefaultTheme = () => {
    setSelectedPalette(defaultTheme);
    setValue('theme.paletteColor', null, { shouldDirty: true });
  };

  useEffect(() => {
    const initialTheme = settings?.theme?.paletteColor || defaultTheme;
    setSelectedPalette(initialTheme);
  }, [settings, defaultTheme]);

  return (
    <div className="p-2">
      <div className="max-w-4xl mx-auto">
        {/* Section de la palette sélectionnée */}
        <div className="mb-10 border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-gray-400 text-neutral-800">
              Selected Palette: {selectedPalette.name}
            </h2>
            <button
              onClick={resetToDefaultTheme}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all"
            >
              Reset to Default
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {selectedPalette.colors.map((color, index) => (
              <div key={index} className="group">
                <div
                  className={`w-full h-24 rounded-lg ${color.class} shadow-md mb-2 transform transition-all duration-300 group-hover:scale-105`}
                />
                <div className="text-center">
                  <p className="font-medium dark:text-gray-400 text-neutral-800 text-sm">
                    {color.name}
                  </p>
                  <p className="font-mono dark:text-gray-400 text-neutral-800 text-xs">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grille des palettes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedPalettes.map((palette, index) => (
            <div
              key={palette.name}
              className={`backdrop-blur-lg border bg-opacity-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                selectedPalette.name === palette.name
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
              onClick={() => handlePaletteColorChange(palette)}
            >
              <div className="h-12 grid grid-cols-2">
                {palette.colors.map((color, colorIndex) => (
                  <div key={color.hex} className={color.class} />
                ))}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-gray-400 mb-1">
                  {palette.name}
                </h3>
                <div className="space-y-2">
                  {palette.colors.map(color => (
                    <div
                      key={color.hex}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${color.class} shadow-md`}
                      />
                      <div>
                        <p className="font-medium text-gray-400 text-sm">
                          {color.name}
                        </p>
                        <p className="text-gray-400 font-mono text-xs">
                          {color.hex}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaletteColor;
