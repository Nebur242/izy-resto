import axios from 'axios';

export const createPayment = async (data: {
  ref: string;
  data: string;
  apiSecret: string;
  apiKey: string;
}) => {
  const response = await axios.post(
    'https://restaurants-project-backend-solitary-brook-2574.fly.dev/api/v1/payments',
    {
      ...data,
      type: 'paytech',
    }
  );

  return response.data;
};

export const getOrderByRef = async (ref: string) => {
  const response = await axios.get<{
    data: { status: 'sale_complete' | 'sale_canceled' | 'pending' }[];
  }>(
    `https://restaurants-project-backend-solitary-brook-2574.fly.dev/api/v1/payments?ref=${ref}`
  );

  const data = response.data.data;

  if (data.length < 1) return null;

  return data[0];
};
