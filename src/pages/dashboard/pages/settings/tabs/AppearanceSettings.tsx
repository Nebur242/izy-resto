import {
  Columns,
  Layout,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  MenuSquare,
  Moon,
  Rows,
  Sun,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTheme } from '../../../../../context/ThemeContext';
import { useSettings } from '../../../../../hooks';
import { RestaurantSettings } from '../../../../../types/settings';
import { HeaderOption } from './components/HeaderOption';
import { TemplateOption } from './components/TemplateOption';
import { ThemeOption } from './components/ThemeOption';
import PaletteColor from './PaletteColor';

export function AppearanceSettings() {
  const { register, watch, setValue } = useFormContext<RestaurantSettings>();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setValue('defaultTheme', newTheme, { shouldDirty: true });
    localStorage.removeItem('theme-preference');

    if (theme !== newTheme) {
      toggleTheme();
    }
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Layout className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Thème par défaut</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeOption
            icon={Sun}
            title="Mode Clair"
            description="Interface lumineuse avec un contraste optimal"
            value="light"
            selected={watch('defaultTheme') === 'light'}
            onChange={handleThemeChange}
            register={register}
          />

          <ThemeOption
            icon={Moon}
            title="Mode Sombre"
            description="Interface sombre pour une meilleure visibilité nocturne"
            value="dark"
            selected={watch('defaultTheme') === 'dark'}
            onChange={handleThemeChange}
            register={register}
          />
        </div>
      </section>

      {settings?.seo.keywords.includes('food-2025') && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Layout className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold">Palette couleur</h2>
          </div>

          <PaletteColor />
        </section>
      )}

      {/* Header Style */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <MenuSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Style d'en-tête</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HeaderOption
            icon={LayoutDashboard}
            title="En-tête Moderne"
            description="Design moderne avec une mise en page élégante"
            value="modern"
            selected={watch('activeHeader') === 'modern'}
            onChange={value =>
              setValue('activeHeader', value, { shouldDirty: true })
            }
            register={register}
          />

          <HeaderOption
            icon={LayoutList}
            title="En-tête Classique"
            description="Design traditionnel avec navigation simple"
            value="classic"
            selected={watch('activeHeader') === 'classic'}
            onChange={value =>
              setValue('activeHeader', value, { shouldDirty: true })
            }
            register={register}
          />
        </div>
      </section>

      {/* Landing Template */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Template de Page d'Accueil</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TemplateOption
            icon={Rows}
            title="Modern"
            description="Design moderne avec une grande image d'en-tête"
            value="modern"
            selected={watch('activeLanding') === 'modern'}
            onChange={value =>
              setValue('activeLanding', value, { shouldDirty: true })
            }
            register={register}
            imageUrl="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=60"
          />

          <TemplateOption
            icon={Columns}
            title="Minimal"
            description="Design épuré et minimaliste"
            value="minimal"
            selected={watch('activeLanding') === 'minimal'}
            onChange={value =>
              setValue('activeLanding', value, { shouldDirty: true })
            }
            register={register}
            imageUrl="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=500&q=60"
          />

          <TemplateOption
            icon={LayoutGrid}
            title="Grid"
            description="Mise en page en grille avec images"
            value="grid"
            selected={watch('activeLanding') === 'grid'}
            onChange={value =>
              setValue('activeLanding', value, { shouldDirty: true })
            }
            register={register}
            imageUrl="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60"
          />
        </div>
      </section>
    </div>
  );
}
