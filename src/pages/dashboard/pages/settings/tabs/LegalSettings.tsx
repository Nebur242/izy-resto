import { FileText } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { RestaurantSettings } from '../../../../../types/settings';

export function LegalSettings() {
  const { register } = useFormContext<RestaurantSettings>();

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Documents Légaux</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Conditions Générales d'Utilisation
            </label>
            <textarea
              {...register('termsOfService')}
              rows={15}
              className="w-full rounded-lg border dark:border-gray-600 p-4 dark:bg-gray-700 font-mono text-sm"
              placeholder="<h2>1. Introduction</h2>&#10;<p>Bienvenue sur notre site...</p>"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Vous pouvez utiliser du HTML pour la mise en forme. Les balises
              suivantes sont supportées: h1-h6, p, ul, ol, li, strong, em, a,
              blockquote
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
