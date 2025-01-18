import { Category } from '../../../types';
import { ApiAction } from '../types';

export interface CategoryState {
  items: Category[];
  lastFetched: number | null;
}

export const initialCategoryState: CategoryState = {
  items: [],
  lastFetched: null
};

export function categoryReducer(state: CategoryState, action: ApiAction): CategoryState {
  if (action.type === 'SET_CATEGORIES') {
    return {
      items: action.payload,
      lastFetched: Date.now()
    };
  }
  return state;
}