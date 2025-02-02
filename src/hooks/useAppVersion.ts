import { useEffect, useState } from 'react';
import { getSettings, Version } from '../services/version/version.service';

export const useAppVersion = () => {
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState('');
  const [version, setVersion] = useState<Version | null>(null);

  const getVersion = async () => {
    try {
      setLoading(true);
      const versionSettings = await getSettings('version');
      setVersion(versionSettings);
    } catch (error: any) {
      console.log(error);
      setErrorLoading(error.message || 'Une erreur est survenue...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVersion();
  }, []);

  return {
    loading,
    errorLoading,
    version,
  };
};
