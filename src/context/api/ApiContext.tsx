import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { menuService, categoryService, orderService, staffService } from '../../services';
import { ApiContextType, ApiAction, PaginationState } from './types';
import { shouldRefresh } from './utils';
import { menuReducer, categoryReducer, orderReducer, staffReducer } from './reducers';

const DEFAULT_PAGE_SIZE = 10;

const initialPaginationState: PaginationState = {
  currentPage: 1,
  totalPages: 1,
  pageSize: DEFAULT_PAGE_SIZE
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

function apiReducer(state: any, action: ApiAction & { pagination?: PaginationState }) {
  switch (action.type) {
    case 'SET_MENU':
      return {
        ...state,
        menu: {
          items: action.payload,
          lastFetched: Date.now(),
          pagination: action.pagination || state.menu.pagination
        }
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: {
          items: action.payload,
          lastFetched: Date.now(),
          pagination: action.pagination || state.categories.pagination
        }
      };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: {
          items: action.payload,
          lastFetched: Date.now(),
          pagination: action.pagination || state.orders.pagination
        }
      };
    case 'SET_STAFF':
      return {
        ...state,
        staff: {
          items: action.payload,
          lastFetched: Date.now(),
          pagination: action.pagination || state.staff.pagination
        }
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          pagination: {
            ...state[action.payload.section].pagination,
            ...action.payload.pagination
          }
        }
      };
    default:
      return state;
  }
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(apiReducer, {
    menu: { items: [], lastFetched: null, pagination: initialPaginationState },
    categories: { items: [], lastFetched: null, pagination: initialPaginationState },
    orders: { items: [], lastFetched: null, pagination: initialPaginationState },
    staff: { items: [], lastFetched: null, pagination: initialPaginationState }
  });

  const setPagination = useCallback((section: keyof typeof state, pagination: Partial<PaginationState>) => {
    dispatch({ 
      type: 'SET_PAGINATION', 
      payload: { section, pagination } 
    });
  }, []);

  const refreshMenu = useCallback(async () => {
    if (!shouldRefresh(state.menu.lastFetched)) return;
    
    try {
      const items = await menuService.getMenuItems();
      dispatch({ 
        type: 'SET_MENU', 
        payload: items,
        pagination: {
          ...state.menu.pagination,
          totalPages: Math.ceil(items.length / state.menu.pagination.pageSize)
        }
      });
    } catch (error) {
      console.error('Error refreshing menu:', error);
    }
  }, [state.menu.lastFetched, state.menu.pagination.pageSize]);

  const refreshCategories = useCallback(async () => {
    if (!shouldRefresh(state.categories.lastFetched)) return;
    
    try {
      const items = await categoryService.getCategories();
      dispatch({ 
        type: 'SET_CATEGORIES', 
        payload: items,
        pagination: {
          ...state.categories.pagination,
          totalPages: Math.ceil(items.length / state.categories.pagination.pageSize)
        }
      });
    } catch (error) {
      console.error('Error refreshing categories:', error);
    }
  }, [state.categories.lastFetched, state.categories.pagination.pageSize]);

  const refreshOrders = useCallback(async () => {
    if (!shouldRefresh(state.orders.lastFetched)) return;
    
    try {
      const items = await orderService.getOrders();
      dispatch({ 
        type: 'SET_ORDERS', 
        payload: items,
        pagination: {
          ...state.orders.pagination,
          totalPages: Math.ceil(items.length / state.orders.pagination.pageSize)
        }
      });
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  }, [state.orders.lastFetched, state.orders.pagination.pageSize]);

  const refreshStaff = useCallback(async () => {
    if (!shouldRefresh(state.staff.lastFetched)) return;
    
    try {
      const items = await staffService.getAll();
      dispatch({ 
        type: 'SET_STAFF', 
        payload: items,
        pagination: {
          ...state.staff.pagination,
          totalPages: Math.ceil(items.length / state.staff.pagination.pageSize)
        }
      });
    } catch (error) {
      console.error('Error refreshing staff:', error);
    }
  }, [state.staff.lastFetched, state.staff.pagination.pageSize]);

  const value: ApiContextType = {
    ...state,
    refreshMenu,
    refreshCategories,
    refreshOrders,
    refreshStaff,
    setPagination
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