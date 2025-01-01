import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RestaurantSettings } from '../../../types';
import { useSettings } from '../../../hooks/useSettings';
import { Tabs } from '../../../components/ui/Tabs';
import { GeneralSettings } from './settings/tabs/GeneralSettings';
import { AppearanceSettings } from './settings/tabs/AppearanceSettings';
import { BusinessSettings } from './settings/tabs/BusinessSettings';
import { IntegrationSettings } from './settings/tabs/IntegrationSettings';
import { SEOSettings } from './settings/tabs/SEOSettings';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'general', label: 'Général' },
  { id: 'appearance', label: 'Apparence' },
  { id: 'business', label: 'Entreprise' },
  { id: 'seo', label: 'SEO' },
  { id: 'integrations', label: 'Intégrations' }
];

export function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [activeTab, setActiveTab] = React.useState('general');
  const methods = useForm<RestaurantSettings>({
    defaultValues: settings || {}
  });

  const { handleSubmit, formState: { isSubmitting, isDirty }, reset } = methods;

  React.useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data: RestaurantSettings) => {
    try {
      await updateSettings(data);
      toast.success('Paramètres mis à jour avec succès');
      reset(data);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Impossible de sauvegarder les paramètres');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'business':
        return <BusinessSettings />;
      case 'seo':
        return <SEOSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-8 px-4 py-8"
      >
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-8">
            {renderTabContent()}
          </div>

          <div className="flex justify-end pt-6 border-t dark:border-gray-700">
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className={`
                px-6 py-2 rounded-lg font-medium text-white
                transition-all duration-200
                ${isDirty && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </motion.div>
    </FormProvider>
  );
}