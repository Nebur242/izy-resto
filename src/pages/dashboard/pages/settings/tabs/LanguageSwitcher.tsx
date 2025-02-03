import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (event: {
    target: { value: string | undefined };
  }) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    if (newLang) {
      localStorage.setItem('language', newLang);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{t('language')}</label>
      <select
        select-name="language"
        value={i18n.language}
        onChange={handleChangeLanguage}
        className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="fr">🇫🇷 Français</option>
        <option value="en">🇬🇧 English</option>
      </select>
    </div>
  );
}
