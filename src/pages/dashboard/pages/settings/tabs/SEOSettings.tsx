import { Globe, Search, Share2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../types/settings';
import { FaviconUploader } from '../../../../../components/settings/seo/FaviconUploader';
import { KeywordsInput } from '../../../../../components/settings/seo/KeywordsInput';
import { LogoUploader } from '../../../../../components/settings/LogoUploader';
import { useSEOUpdater } from '../../../../../hooks/useSEOUpdater';

export function SEOSettings() {
  const { register, watch, setValue } = useFormContext<RestaurantSettings>();
  
  // Handle real-time SEO updates
  useSEOUpdater(watch('seo.title'), watch('seo.favicon'));

  return (
    <div className="space-y-8">
      {/* Basic SEO Settings */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Paramètres SEO</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Titre du site
            </label>
            <input
              type="text"
              {...register('seo.title')}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              placeholder="Restaurant Name - Tagline"
            />
            <p className="mt-1 text-sm text-gray-500">
              Apparaît dans l'onglet du navigateur et les résultats de recherche
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register('seo.description')}
              rows={3}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              placeholder="Une brève description de votre restaurant..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Apparaît dans les résultats de recherche (150-160 caractères recommandés)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mots-clés
            </label>
            <KeywordsInput
              value={watch('seo.keywords') || []}
              onChange={(keywords) => setValue('seo.keywords', keywords, { shouldDirty: true })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Mots-clés pertinents pour votre restaurant
            </p>
          </div>
        </div>
      </section>

      {/* Visual Assets */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Ressources visuelles</h2>
        </div>

        <div className="space-y-6">
          <FaviconUploader
            value={watch('seo.favicon')}
            onChange={(url) => setValue('seo.favicon', url, { shouldDirty: true })}
          />

          <div>
            <LogoUploader
              value={watch('seo.ogImage')}
              onChange={(url) => setValue('seo.ogImage', url, { shouldDirty: true })}
              label="Image de partage social"
              description="Image affichée lors du partage sur les réseaux sociaux (1200x630px recommandé)"
            />
          </div>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Intégration sociale</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Twitter Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                {...register('seo.twitterHandle')}
                className="w-full rounded-lg border dark:border-gray-600 p-2 pl-8 dark:bg-gray-700"
                placeholder="username"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Utilisé pour les Twitter Cards
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Google Site Verification
            </label>
            <input
              type="text"
              {...register('seo.googleSiteVerification')}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              placeholder="Code de vérification Google"
            />
            <p className="mt-1 text-sm text-gray-500">
              Code de vérification pour Google Search Console
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}