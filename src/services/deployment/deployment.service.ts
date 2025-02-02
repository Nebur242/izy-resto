import axios from 'axios';
import { apiConfig, secretKeys } from '../../config/api.config';
import { encryptData } from '../../utils/functions';

export type Version = {
  id: number;
  key: string;
  value: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export const launchDeployment = async (data: {
  siteId: string;
  version: string;
}) => {
  const encryptedData = encryptData(
    {
      version: data.version,
      password: secretKeys.secret,
    },
    secretKeys.secret
  );

  const response = await axios.get<{
    data: Version;
  }>(`${apiConfig.baseUri}/deploy/${data.siteId}?data=${encryptedData}`);

  return response.data.data;
};
