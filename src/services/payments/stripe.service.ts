import axios from 'axios';
import { encryptData } from '../../utils/functions';
import { apiConfig, secretKeys } from '../../config/api.config';

export const processPayment = async (data: {
  amount: number;
  currency: string;
  apiSecret: string;
  paymentMethodId: string;
  return_url: string;
}) => {
  const encryptedData = encryptData(data, secretKeys.secret);
  const response = await axios.post<{
    data:
      | {
          success: boolean;
        }
      | {
          requiresAction: boolean;
          paymentIntentClientSecret: string;
        };
  }>(`${apiConfig.baseUri}/payments/process-payment`, { data: encryptedData });

  if (!response.data) return null;

  return response.data.data;
};
