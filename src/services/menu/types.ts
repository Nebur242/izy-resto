import { MenuItem } from '../../types';

export interface MenuServiceError extends Error {
  code: string;
}

export interface MenuFilters {
  category?: string;
  search?: string;
}

export type MenuItemInput = Omit<MenuItem, 'id'>;
