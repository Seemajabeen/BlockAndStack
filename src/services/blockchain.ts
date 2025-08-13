import { User } from '../types';

// Simulated Aptos Move smart contract integration
export class AptosService {
  private static instance: AptosService;
  
  static getInstance(): AptosService {
    if (!AptosService.instance) {
      AptosService.instance = new AptosService();
    }
    return AptosService.instance;
  }

  // Simulate user registration on blockchain
  async registerUser(userData: Omit<User, 'id' | 'walletAddress' | 'isVerified' | 'createdAt'>): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          walletAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
          isVerified: false,
          createdAt: new Date().toISOString()
        };
        resolve(newUser);
      }, 1500);
    });
  }

  // Simulate smart contract coin earning
  async earnCoins(userId: string, caloriesBurned: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1 calorie = 0.1 coins
        const coinsEarned = Math.floor(caloriesBurned * 0.1);
        resolve(coinsEarned);
      }, 1000);
    });
  }

  // Simulate spending coins
  async spendCoins(userId: string, amount: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  // Simulate wallet connection
  async connectWallet(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const walletAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
        resolve(walletAddress);
      }, 2000);
    });
  }

  // Simulate activity verification on blockchain
  async verifyActivity(activityData: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });
  }
}