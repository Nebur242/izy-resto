import { Order } from '../../../types';
import { ApiAction } from '../types';

export interface OrderState {
  items: Order[];
  lastFetched: number | null;
}

export const initialOrderState: OrderState = {
  items: [],
  lastFetched: null
};

export function orderReducer(state: OrderState, action: ApiAction): OrderState {
  if (action.type === 'SET_ORDERS') {
    return {
      items: action.payload,
      lastFetched: Date.now()
    };
  }
  return state;
}