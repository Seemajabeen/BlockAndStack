import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { User, ActivityData } from '../types';

export class AptosService {
  private static instance: AptosService;
  private aptos: Aptos;
  private moduleAddress = "0x42"; // This would be the actual deployed contract address

  private constructor() {
    const config = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(config);
  }

  static getInstance(): AptosService {
    if (!AptosService.instance) {
      AptosService.instance = new AptosService();
    }
    return AptosService.instance;
  }

  // Check if user is registered on-chain
  async isUserRegistered(walletAddress: string): Promise<boolean> {
    try {
      const response = await this.aptos.view({
        function: `${this.moduleAddress}::fitcoin::is_user_registered`,
        arguments: [walletAddress],
      });
      return response[0] as boolean;
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  }

  // Get user profile from blockchain
  async getUserProfile(walletAddress: string): Promise<User | null> {
    try {
      const isRegistered = await this.isUserRegistered(walletAddress);
      if (!isRegistered) return null;

      const response = await this.aptos.view({
        function: `${this.moduleAddress}::fitcoin::get_user_profile`,
        arguments: [walletAddress],
      });

      const [username, fullName, height, weight, fitnessGoal, totalCalories, totalActivities, balance, totalEarned, totalSpent, createdAt, isVerified] = response;

      return {
        id: walletAddress,
        walletAddress,
        username: username as string,
        fullName: fullName as string,
        email: '', // Email is stored off-chain for privacy
        dateOfBirth: '', // Not stored on-chain for privacy
        height: height as number,
        weight: weight as number,
        fitnessGoal: fitnessGoal as string,
        isVerified: isVerified as boolean,
        createdAt: new Date((createdAt as number) * 1000).toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Register user on blockchain
  async registerUser(
    walletAddress: string,
    userData: {
      username: string;
      fullName: string;
      height: number;
      weight: number;
      fitnessGoal: string;
    }
  ): Promise<string> {
    try {
      // In a real app, this would be called through the wallet adapter
      // The user's wallet would sign and submit this transaction
      const transaction = {
        function: `${this.moduleAddress}::fitcoin::register_user`,
        arguments: [
          userData.username,
          userData.fullName,
          userData.height,
          userData.weight,
          userData.fitnessGoal,
        ],
      };

      // Return transaction payload for wallet to sign
      return JSON.stringify(transaction);
    } catch (error) {
      console.error('Error creating registration transaction:', error);
      throw error;
    }
  }

  // Record activity on blockchain
  async recordActivity(
    walletAddress: string,
    activityType: string,
    duration: number,
    caloriesBurned: number
  ): Promise<string> {
    try {
      const transaction = {
        function: `${this.moduleAddress}::fitcoin::record_activity`,
        arguments: [
          activityType,
          duration,
          caloriesBurned,
        ],
      };

      return JSON.stringify(transaction);
    } catch (error) {
      console.error('Error creating activity transaction:', error);
      throw error;
    }
  }

  // Purchase marketplace item
  async purchaseItem(
    walletAddress: string,
    itemId: string,
    itemTitle: string,
    cost: number
  ): Promise<string> {
    try {
      const transaction = {
        function: `${this.moduleAddress}::fitcoin::purchase_item`,
        arguments: [
          itemId,
          itemTitle,
          cost,
        ],
      };

      return JSON.stringify(transaction);
    } catch (error) {
      console.error('Error creating purchase transaction:', error);
      throw error;
    }
  }

  // Get user activities from blockchain
  async getUserActivities(walletAddress: string): Promise<ActivityData[]> {
    try {
      const response = await this.aptos.view({
        function: `${this.moduleAddress}::fitcoin::get_user_activities`,
        arguments: [walletAddress],
      });

      const activities = response[0] as any[];
      return activities.map((activity, index) => ({
        id: `${walletAddress}_${index}`,
        userId: walletAddress,
        activityType: activity.activity_type as 'walking' | 'running' | 'cycling' | 'workout',
        duration: activity.duration as number,
        caloriesBurned: activity.calories_burned as number,
        coinsEarned: activity.coins_earned as number,
        timestamp: new Date((activity.timestamp as number) * 1000).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  }

  // Get FitCoin balance
  async getFitCoinBalance(walletAddress: string): Promise<number> {
    try {
      const response = await this.aptos.view({
        function: `${this.moduleAddress}::fitcoin::get_fitcoin_balance`,
        arguments: [walletAddress],
      });
      return response[0] as number;
    } catch (error) {
      console.error('Error fetching FitCoin balance:', error);
      return 0;
    }
  }

  // Simulate earning coins (for demo purposes)
  async earnCoins(userId: string, caloriesBurned: number): Promise<number> {
    // In real implementation, this would call recordActivity
    return Math.floor(caloriesBurned * 0.1);
  }

  // Simulate spending coins (for demo purposes)
  async spendCoins(userId: string, amount: number): Promise<boolean> {
    // In real implementation, this would call purchaseItem
    return true;
  }
}