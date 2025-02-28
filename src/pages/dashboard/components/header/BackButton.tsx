import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components/ui/Button';

export function BackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      {t('go-back')}
    </Button>
  );
}
