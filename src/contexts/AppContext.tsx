import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ActivityData, Coin } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  coins: Coin;
  setCoins: (coins: Coin) => void;
  activities: ActivityData[];
  setActivities: (activities: ActivityData[]) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isTracking: boolean;
  setIsTracking: (tracking: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [coins, setCoins] = useState<Coin>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0
  });
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('fitcoin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsConnected(true);
    }

    const savedCoins = localStorage.getItem('fitcoin_coins');
    if (savedCoins) {
      setCoins(JSON.parse(savedCoins));
    }

    const savedActivities = localStorage.getItem('fitcoin_activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      coins,
      setCoins,
      activities,
      setActivities,
      isConnected,
      setIsConnected,
      isTracking,
      setIsTracking
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};