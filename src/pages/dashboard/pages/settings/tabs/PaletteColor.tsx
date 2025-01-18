import { useEffect, useState } from 'react';
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
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);

  const handlePaletteColorChange = async (palette: typePaletteColor) => {
    setSelectedPalette(palette);
    setValue('theme.paletteColor', palette, {
      shouldDirty: true,
    });
  };

  useEffect(() => {
    setSelectedPalette(settings?.theme.paletteColor || colorPalettes[0]);
  }, [settings]);

  return (
    <div className="p-2">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold dark:text-gray-400 text-neutral-800 mb-1">
                Selected Palette: {selectedPalette.name}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedPalette.colors.map((color, index) => (
              <div key={index} className="group">
                <div
                  className={`w-full h-24 rounded-lg ${color.class} shadow-md mb-2 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2`}
                ></div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {colorPalettes.map((palette, index) => (
            <div
              key={index}
              className={`backdrop-blur-lg border bg-opacity-50 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedPalette.name === palette.name
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
              onClick={() => handlePaletteColorChange(palette)} // Mettre à jour avec l'objet complet
            >
              <div className="h-12 grid grid-cols-4">
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className={`${color.class} transition-all duration-300 hover:scale-105`}
                  ></div>
                ))}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-gray-400 mb-1">
                  {palette.name}
                </h3>

                <div className="space-y-2">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${color.class} shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-6`}
                      ></div>
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
      </div>
    </div>
  );
}

export default PaletteColor;
