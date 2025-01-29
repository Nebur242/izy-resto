import {
  Facebook,
  Instagram,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import packageJson from '../../../package.json';
import { useSettings } from '../../hooks/useSettings';
import { SocialMediaProfile } from '../../types/settings';
import Tiktok from '../svg/Tiktok';
import Whatsapp from '../svg/whatsapp';
import { Container } from '../ui/Container';

interface SocialMediaIconProps {
  profile: SocialMediaProfile;
}

function SocialMediaIcon({ profile }: SocialMediaIconProps) {
  const { settings } = useSettings();
  const icons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    tiktok: Tiktok,
    whatsapp: Whatsapp,
  };

  console.log(
    settings?.theme?.paletteColor.colors[0].textPrimary,
    ' settings?.theme?.paletteColor.colors[0].textClass'
  );

  const Icon = icons[profile.platform];
  if (!Icon) return null;

  return (
    <a
      href={
        profile.platform === 'whatsapp'
          ? `https://wa.me/${profile.url}`
              .replace(/\+/g, '')
              .replace(/\s+/g, '')
          : profile.url
      }
      target="_blank"
      rel="noopener noreferrer"
      className=" hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      aria-label={`Visit our ${profile.platform}`}
    >
      <Icon
        className={`w-7 h-7 text-white dark:${
          settings?.theme?.paletteColor.colors[0].textPrimary || 'text-gray-400'
        }`}
      />
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
    <footer
      className={`${
        `${settings?.theme?.paletteColor?.colors[0]?.class} dark:bg-gray-900/90` ||
        'bg-white'
      } border-t border-gray-200 dark:border-gray-700 py-8 mt-10 text-white dark:text-gray-400 `}
    >
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Restaurant Info */}
          <div className="text-center md:text-left">
            <h3
              className={`text-lg font-semibold
              text-white mb-3`}
            >
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
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm text-white dark:text-gray-400 mb-2">
                <MapPin
                  className={`w-4 h-4 flex-shrink-0  text-white  dark:${
                    settings?.theme?.paletteColor.colors[0].textPrimary ||
                    'text-gray-400'
                  }`}
                />
                <span>{settings.address}</span>
              </p>
            )}
            {settings?.phone && (
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm text-white dark:text-gray-400 mb-2">
                <Phone
                  className={`w-4 h-4 flex-shrink-0  text-white  dark:${
                    settings?.theme?.paletteColor.colors[0].textPrimary ||
                    'text-gray-400'
                  }`}
                />
                <span>{settings.phone}</span>
              </p>
            )}
            {settings?.email && (
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm text-white dark:text-gray-400">
                <Mail
                  className={`w-4 h-4 flex-shrink-0  text-white  dark:${
                    settings?.theme?.paletteColor.colors[0].textPrimary ||
                    'text-gray-400'
                  }`}
                />
                <span>{settings?.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-center md:justify-end gap-4 mt-4 text-sm">
          <Link
            to={settings?.termsOfService ? '/terms' : '#'}
            className="text-white hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <LinkIcon
              className={`w-3 h-3 text-white  dark:${
                settings?.theme?.paletteColor.colors[0].textPrimary ||
                'text-gray-400'
              }`}
            />
            Conditions d'utilisation
          </Link>
        </div>
        <div className="flex justify-between gap-2">
          <small>Tous droits réservés © {new Date().getFullYear()} - AF</small>
          <small className="text-center block">v{packageJson.version}</small>
        </div>
      </Container>
    </footer>
  );
}
