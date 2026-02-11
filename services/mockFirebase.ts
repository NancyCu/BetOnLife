import { Bet, User } from '../types';

// In-memory storage for the session
let bets: Bet[] = [
  { id: '1', userId: 'u1', userName: 'Big Dave', amount: 5, team: 'TALLOW', targetValue: 420, timestamp: Date.now() - 100000 },
  { id: '2', userId: 'u2', userName: 'VeganVicky', amount: 5, team: 'RABBIT_FOOD', targetValue: 210, timestamp: Date.now() - 200000 },
  { id: '3', userId: 'u3', userName: 'BaconKing', amount: 5, team: 'TALLOW', targetValue: 550, timestamp: Date.now() - 50000 },
];

const ENTRY_FEE = 5;

// Simulating a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAuth = {
  login: async (): Promise<User> => {
    await delay(800);
    return {
      uid: 'user_123',
      displayName: 'Cholesterol Champ',
      balance: 500,
      photoURL: 'https://picsum.photos/100/100'
    };
  }
};

export const MockDB = {
  // Check if user already has a bet
  getUserBet: async (userId: string): Promise<Bet | undefined> => {
    await delay(300);
    return bets.find(b => b.userId === userId);
  },

  placeBet: async (user: User, team: 'RABBIT_FOOD' | 'TALLOW', targetValue: number): Promise<Bet> => {
    await delay(1000);
    
    // Enforce One Bet Rule (Mock)
    if (bets.find(b => b.userId === user.uid)) {
      throw new Error("You have already placed a bet!");
    }

    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      userName: user.displayName,
      amount: ENTRY_FEE,
      team: team,
      targetValue: targetValue,
      timestamp: Date.now()
    };
    
    bets.push(newBet);
    return newBet;
  },
  
  subscribeToPot: (callback: (total: number) => void) => {
    // Initial callback
    callback(bets.length * ENTRY_FEE);
    
    // Poll for updates (simulating real-time listeners)
    const interval = setInterval(() => {
      // Simulate random people joining occasionally
      if (Math.random() > 0.8) {
        bets.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: `u_${Math.random()}`,
          userName: `Random_Eater_${Math.floor(Math.random()*100)}`,
          amount: ENTRY_FEE,
          team: Math.random() > 0.5 ? 'TALLOW' : 'RABBIT_FOOD',
          targetValue: Math.floor(Math.random() * 400) + 200,
          timestamp: Date.now()
        });
        callback(bets.length * ENTRY_FEE);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  },

  subscribeToBets: (callback: (bets: Bet[]) => void) => {
    callback([...bets]);
    const interval = setInterval(() => {
      callback([...bets]);
    }, 3000);
    return () => clearInterval(interval);
  }
};