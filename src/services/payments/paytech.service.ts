import axios from 'axios';
import { API_URI } from '../../constants/defaultSettings';

export const createPayment = async (data: {
  ref: string;
  data: string;
  apiSecret: string;
  apiKey: string;
  type: 'paytech' | 'cinetpay';
}) => {
  const response = await axios.post(`${API_URI}/payments`, data);

  return response.data;
};

export const getOrderByRef = async (ref: string) => {
  const response = await axios.get<{
    data: { status: 'sale_complete' | 'sale_canceled' | 'pending' | 'VAL' }[];
  }>(`${API_URI}/payments?ref=${ref}`);

  const data = response.data.data;

  if (data.length < 1) return null;

  return data[0];
};
