import axios from 'axios';
import { useState } from 'react';
import { CartItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  createPayment,
  getOrderByRef,
} from '../services/payments/paytech.service';

export const usePaytech = ({
  paymentMethod,
  total,
  cart,
  onConfirm,
}: //   commandRef,
{
  //   commandRef: string;
  paymentMethod: {
    apiKey: string;
    apiSecret: string;
  };
  total: number;
  cart: CartItem[];
  onConfirm: () => void;
}) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentResponse, setPaymentResponse] = useState<{
    success: number;
    redirect_url: string;
    token: string;
  } | null>(null);

  const [ref, setRef] = useState('');

  const requestPayment = async () => {
    try {
      setIsPaying(true);
      const commandRef = uuidv4();

      if (ref) {
        const order = await getOrderByRef(ref);
        if (order && order.status === 'sale_complete') {
          return onConfirm();
        }
      }

      setRef(commandRef);

      const data = {
        item_name: cart.map(item => item.name).join(' - '),
        item_price: total,
        currency: 'XOF',
        ref_command: commandRef,
        command_name: 'Paiement de la commande',
        env: 'prod',
        ipn_url:
          'https://restaurants-project-backend-solitary-brook-2574.fly.dev/api/v1/payments/confirm',
        success_url: `${window.location.origin}/paytech/success`,
        cancel_url: `${window.location.origin}/paytech/failed`,
      };

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        API_KEY: paymentMethod.apiKey,
        API_SECRET: paymentMethod.apiSecret,
      };

      const response = await axios.post<{
        success: number;
        redirect_url: string;
        token: string;
      }>(`https://paytech.sn/api/payment/request-payment`, data, {
        headers,
      });

      await createPayment({
        ref: data.ref_command,
        data: JSON.stringify(data),
        apiKey: paymentMethod.apiKey,
        apiSecret: paymentMethod.apiSecret,
      });

      setPaymentSucceeded(true);
      setPaymentResponse(response.data);
    } catch (error: any) {
      console.log(error);
      setPaymentSucceeded(false);
      setPaymentError(error?.message || 'Erreur de paiement');
    } finally {
      setIsPaying(false);
    }
  };

  return {
    isPaying,
    paymentSucceeded,
    paymentError,
    paymentResponse,
    requestPayment,
    ref,
  };
};
