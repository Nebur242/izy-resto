import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { useTranslation } from '../../../../i18n/useTranslation';

export function BackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => navigate('/')}
      className="text-gray-900 dark:text-white"
    >
      <ArrowLeft className="w-4 h-4 mr-2 text-gray-900 dark:text-white" />
      {t('common.goBack')}
    </Button>
  );
}
