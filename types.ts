export interface User {
  uid: string;
  displayName: string;
  photoURL?: string;
  balance: number;
}

export interface Bet {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  team: 'RABBIT_FOOD' | 'TALLOW';
  targetValue: number;
  timestamp: number;
}

export interface PotState {
  total: number;
  entryFee: number;
}

export enum TabView {
  WAITING_ROOM = 'WAITING_ROOM',
  LAB_RESULTS = 'LAB_RESULTS'
}