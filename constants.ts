
export const TICKER_MESSAGES = [
  "Current status: Emotional Damage",
  "MÁ LA (MOM IS SCREAMING)",
  "Your cousin Timmy is a doctor",
  "GẶP ÔNG BÀ SOON",
  "DRINK SOME TEA, YOU'LL BE FINE",
  "Why you so fat?",
  "ANCESTORS ARE WATCHING YOUR DIET",
  "Eat more bitter melon",
  "Blood Type: Fish Sauce",
  "Disappointment level: High",
  "Rice is life, but this is too much",
  "Only B+? Why not A+?",
  "Remember to bow to your ancestors"
];

export const COLORS = {
  background: '#0f0f1b',
  primary: '#00e676', // Neon Green
  danger: '#ef4444', // Red
  cardBg: '#1e1b2e',
};

export const MOCK_BETS = [
  { id: '1', userId: 'u1', userName: 'Big Dave', amount: 50, team: 'TALLOW', targetValue: 442, timestamp: Date.now() - 100000 },
  { id: '2', userId: 'u2', userName: 'VeganVicky', amount: 50, team: 'RABBIT_FOOD', targetValue: 185, timestamp: Date.now() - 200000 },
  { id: '3', userId: 'u3', userName: 'BaconKing', amount: 50, team: 'TALLOW', targetValue: 580, timestamp: Date.now() - 50000 },
] as const;

// Set target date to 3 days, 14 hours, and 15 minutes from now for demo purposes
export const TARGET_DATE = Date.now() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (15 * 60 * 1000);