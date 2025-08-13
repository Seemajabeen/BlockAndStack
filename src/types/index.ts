export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  walletAddress: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ActivityData {
  id: string;
  userId: string;
  activityType: 'walking' | 'running' | 'cycling' | 'workout';
  duration: number; // in minutes
  caloriesBurned: number;
  coinsEarned: number;
  timestamp: string;
}

export interface Coin {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  coinCost: number;
  category: 'insurance' | 'advertising' | 'eco';
  available: boolean;
}