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
  const encryptedData = encryptData(data, secretKeys.secret);

  const response = await axios.post<{
    data: Version;
  }>(`${apiConfig.baseUri}/deploy/client`, {
    data: encryptedData,
  });

  return response.data.data;
};
