import { useState } from 'react';

function PaletteColor() {
  const [selectedPalette, setSelectedPalette] = useState(0);

  const colorPalettes = [
    {
      name: 'Forest',
      description: 'Perfect for nature and eco-friendly themes',
      colors: [
        { name: 'Primary', hex: '#4CAF50', class: 'bg-[#4CAF50]' },
        { name: 'Secondary', hex: '#1E2923', class: 'bg-[#1E2923]' },
        { name: 'Accent', hex: '#45a049', class: 'bg-[#45a049]' },
        { name: 'Text', hex: '#FFFFFF', class: 'bg-white' },
      ],
    },
    {
      name: 'Ocean',
      description: 'Ideal for water and technology themes',
      colors: [
        { name: 'Primary', hex: '#2196F3', class: 'bg-[#2196F3]' },
        { name: 'Secondary', hex: '#1A237E', class: 'bg-[#1A237E]' },
        { name: 'Accent', hex: '#03A9F4', class: 'bg-[#03A9F4]' },
        { name: 'Text', hex: '#FFFFFF', class: 'bg-white' },
      ],
    },
    {
      name: 'Sunset',
      description: 'Perfect for warm and energetic designs',
      colors: [
        { name: 'Primary', hex: '#FF9800', class: 'bg-[#FF9800]' },
        { name: 'Secondary', hex: '#BF360C', class: 'bg-[#BF360C]' },
        { name: 'Accent', hex: '#FF5722', class: 'bg-[#FF5722]' },
        { name: 'Text', hex: '#FFFFFF', class: 'bg-white' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Color Palette Explorer
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the perfect color combination for your next project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {colorPalettes.map((palette, index) => (
            <div
              key={index}
              className={`bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedPalette === index
                  ? 'ring-2 ring-offset-4 ring-offset-gray-900 ring-white'
                  : ''
              }`}
              onClick={() => setSelectedPalette(index)}
            >
              <div className="h-32 grid grid-cols-4">
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className={`${color.class} transition-all duration-300 hover:scale-105`}
                  ></div>
                ))}
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {palette.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {palette.description}
                </p>
                <div className="space-y-4">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex items-center space-x-4"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl ${color.class} shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12`}
                      ></div>
                      <div>
                        <p className="font-medium text-white">{color.name}</p>
                        <p className="text-gray-400 font-mono text-sm">
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

        <div className="mt-16 bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-2xl p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Selected Palette: {colorPalettes[selectedPalette].name}
              </h2>
              <p className="text-gray-400">
                {colorPalettes[selectedPalette].description}
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Copy Values
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {colorPalettes[selectedPalette].colors.map((color, index) => (
              <div key={index} className="group">
                <div
                  className={`w-full h-48 rounded-xl ${color.class} shadow-xl mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3`}
                ></div>
                <div className="text-center">
                  <p className="font-medium text-white mb-1">{color.name}</p>
                  <p className="font-mono text-gray-400 text-sm">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaletteColor;
