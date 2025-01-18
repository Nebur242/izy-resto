import { StaffMember } from '../../../types/staff';
import { ApiAction } from '../types';

export interface StaffState {
  items: StaffMember[];
  lastFetched: number | null;
}

export const initialStaffState: StaffState = {
  items: [],
  lastFetched: null
};

export function staffReducer(state: StaffState, action: ApiAction): StaffState {
  if (action.type === 'SET_STAFF') {
    return {
      items: action.payload,
      lastFetched: Date.now()
    };
  }
  return state;
}