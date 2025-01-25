import axios from 'axios';
import { apiConfig, secretKeys } from '../../config/api.config';
import { encryptData } from '../../utils/functions';

export const createPayment = async (data: {
  ref: string;
  data: string;
  apiSecret: string;
  apiKey: string;
  type: 'paytech' | 'cinetpay';
}) => {
  const encryptedData = encryptData(data, secretKeys.secret);

  const response = await axios.post(`${apiConfig.baseUri}/payments`, {
    data: encryptedData,
  });

  return response.data;
};

export const getOrderByRef = async (ref: string) => {
  const response = await axios.get<{
    data: { status: 'sale_complete' | 'sale_canceled' | 'pending' | 'VAL' }[];
  }>(`${apiConfig.baseUri}/payments?ref=${ref}`);

  const data = response.data.data;

  if (data.length < 1) return null;

  return data[0];
};
