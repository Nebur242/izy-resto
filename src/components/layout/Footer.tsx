import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Youtube,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { useSettings } from '../../hooks/useSettings';
import { SocialMediaProfile } from '../../types/settings';

interface SocialMediaIconProps {
  profile: SocialMediaProfile;
}

function SocialMediaIcon({ profile }: SocialMediaIconProps) {
  const icons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
  };

  const Icon = icons[profile.platform];
  if (!Icon) return null;

  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      aria-label={`Visit our ${profile.platform}`}
    >
      <Icon className="w-7 h-7" />
    </a>
  );
}

export function Footer() {
  const { settings } = useSettings();

  // Filter only active social media profiles
  const activeSocialProfiles =
    settings?.socialMedia?.filter(
      profile => profile.active && profile.url.trim()
    ) || [];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Restaurant Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {settings?.name || 'Restaurant'}
            </h3>

            {activeSocialProfiles.length > 0 && (
              <div className="flex justify-center md:justify-start gap-4 mb-4">
                {activeSocialProfiles.map(profile => (
                  <SocialMediaIcon key={profile.platform} profile={profile} />
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            {settings?.address && (
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{settings.address}</span>
              </p>
            )}
            {settings?.phone && (
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{settings.phone}</span>
              </p>
            )}
            {settings?.email && (
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{settings?.email}</span>
              </p>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
