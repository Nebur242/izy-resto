import axios from 'axios';

export const createIntent = async (data: {
  amount: number;
  currency: string;
  apiSecret: string;
}) => {
  const response = await axios.post<{
    data: {
      clientSecret: string;
    };
  }>(`http://localhost:3000/api/v1/payments/create-intent`, data);

  if (!response.data) return null;

  return response.data.data.clientSecret;
};

export const processPayment = async (data: {
  amount: number;
  currency: string;
  apiSecret: string;
  paymentMethodId: string;
  return_url: string;
}) => {
  const response = await axios.post<{
    data:
      | {
          success: boolean;
        }
      | {
          requiresAction: boolean;
          paymentIntentClientSecret: string;
        };
  }>(`http://localhost:3000/api/v1/payments/process-payment`, data);

  if (!response.data) return null;

  return response.data.data;
};
