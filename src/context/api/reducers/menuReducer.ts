import { MenuItem } from '../../../types';
import { ApiAction } from '../types';

export interface MenuState {
  items: MenuItem[];
  lastFetched: number | null;
}

export const initialMenuState: MenuState = {
  items: [],
  lastFetched: null
};

export function menuReducer(state: MenuState, action: ApiAction): MenuState {
  if (action.type === 'SET_MENU') {
    return {
      items: action.payload,
      lastFetched: Date.now()
    };
  }
  return state;
}