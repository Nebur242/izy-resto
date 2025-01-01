import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Share2, Facebook, Instagram, Twitter, Linkedin, Youtube, Plus, X } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import { RestaurantSettings, SocialMediaProfile } from '../../../../../types/settings';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
];

export function SocialMediaSettings() {
  const { watch, setValue } = useFormContext<RestaurantSettings>();
  const socialMedia = watch('socialMedia') || [];

  const handleAddProfile = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setValue('socialMedia', [
      ...socialMedia,
      { platform: 'facebook', url: '', active: true }
    ], { shouldDirty: true });
  };

  const handleRemoveProfile = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Prevent form submission
    setValue('socialMedia', 
      socialMedia.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const handleUpdateProfile = (e: React.MouseEvent | React.ChangeEvent, index: number, updates: Partial<SocialMediaProfile>) => {
    e.preventDefault(); // Prevent form submission
    const updatedProfiles = [...socialMedia];
    updatedProfiles[index] = { ...updatedProfiles[index], ...updates };
    setValue('socialMedia', updatedProfiles, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Réseaux Sociaux</h2>
        </div>
        <Button type="button" onClick={handleAddProfile}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un profil
        </Button>
      </div>

      <div className="space-y-4">
        {socialMedia.map((profile, index) => {
          const platform = PLATFORMS.find(p => p.id === profile.platform);
          const Icon = platform?.icon || Share2;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-[200px,1fr,auto] gap-4 items-center">
                {/* Platform Selection */}
                <select
                  value={profile.platform}
                  onChange={(e) => handleUpdateProfile(e, index, { 
                    platform: e.target.value as SocialMediaProfile['platform'] 
                  })}
                  className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                >
                  {PLATFORMS.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>

                {/* URL Input */}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={profile.url}
                    onChange={(e) => handleUpdateProfile(e, index, { url: e.target.value })}
                    placeholder={`https://${profile.platform}.com/...`}
                    className="w-full pl-10 rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={profile.active ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={(e) => handleUpdateProfile(e, index, { active: !profile.active })}
                  >
                    {profile.active ? 'Actif' : 'Inactif'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleRemoveProfile(e, index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {socialMedia.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Share2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun profil social ajouté
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Cliquez sur "Ajouter un profil" pour commencer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}