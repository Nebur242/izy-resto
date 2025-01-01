import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { MenuItem, Category, Order, StaffMember } from '../types';
import { menuService, categoryService, orderService, staffService } from '../services';

interface ApiState {
  menu: {
    items: MenuItem[];
    lastFetched: number | null;
  };
  categories: {
    items: Category[];
    lastFetched: number | null;
  };
  orders: {
    items: Order[];
    lastFetched: number | null;
  };
  staff: {
    items: StaffMember[];
    lastFetched: number | null;
  };
}

interface ApiContextType extends ApiState {
  refreshMenu: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshStaff: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: ApiState = {
  menu: { items: [], lastFetched: null },
  categories: { items: [], lastFetched: null },
  orders: { items: [], lastFetched: null },
  staff: { items: [], lastFetched: null }
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

type ApiAction = 
  | { type: 'SET_MENU'; payload: MenuItem[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_STAFF'; payload: StaffMember[] };

function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'SET_MENU':
      return {
        ...state,
        menu: {
          items: action.payload,
          lastFetched: Date.now()
        }
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: {
          items: action.payload,
          lastFetched: Date.now()
        }
      };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: {
          items: action.payload,
          lastFetched: Date.now()
        }
      };
    case 'SET_STAFF':
      return {
        ...state,
        staff: {
          items: action.payload,
          lastFetched: Date.now()
        }
      };
    default:
      return state;
  }
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  const shouldRefresh = useCallback((lastFetched: number | null) => {
    return !lastFetched || Date.now() - lastFetched > CACHE_DURATION;
  }, []);

  const refreshMenu = useCallback(async () => {
    if (!shouldRefresh(state.menu.lastFetched)) return;
    const items = await menuService.getMenuItems();
    dispatch({ type: 'SET_MENU', payload: items });
  }, [state.menu.lastFetched, shouldRefresh]);

  const refreshCategories = useCallback(async () => {
    if (!shouldRefresh(state.categories.lastFetched)) return;
    const items = await categoryService.getCategories();
    dispatch({ type: 'SET_CATEGORIES', payload: items });
  }, [state.categories.lastFetched, shouldRefresh]);

  const refreshOrders = useCallback(async () => {
    if (!shouldRefresh(state.orders.lastFetched)) return;
    const items = await orderService.getOrders();
    dispatch({ type: 'SET_ORDERS', payload: items });
  }, [state.orders.lastFetched, shouldRefresh]);

  const refreshStaff = useCallback(async () => {
    if (!shouldRefresh(state.staff.lastFetched)) return;
    const items = await staffService.getAll();
    dispatch({ type: 'SET_STAFF', payload: items });
  }, [state.staff.lastFetched, shouldRefresh]);

  const value = {
    ...state,
    refreshMenu,
    refreshCategories,
    refreshOrders,
    refreshStaff
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}