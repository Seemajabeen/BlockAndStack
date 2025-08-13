import React, { useState } from 'react';
import { User, Wallet, Activity, Settings, LogOut, Award, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Profile: React.FC = () => {
  const { user, coins, activities, setUser, setIsConnected } = useApp();
  const [showWallet, setShowWallet] = useState(false);

  const totalActivities = activities.length;
  const totalCalories = activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
  const avgDailyCalories = totalActivities > 0 ? Math.floor(totalCalories / Math.max(totalActivities, 1)) : 0;

  const handleLogout = () => {
    localStorage.removeItem('fitcoin_user');
    localStorage.removeItem('fitcoin_coins');
    localStorage.removeItem('fitcoin_activities');
    setUser(null);
    setIsConnected(false);
  };

  const achievements = [
    { name: 'First Steps', description: 'Complete your first activity', earned: totalActivities > 0 },
    { name: 'Coin Collector', description: 'Earn 100 FitCoins', earned: coins.totalEarned >= 100 },
    { name: 'Calorie Crusher', description: 'Burn 1000 calories', earned: totalCalories >= 1000 },
    { name: 'Consistency King', description: 'Complete 10 activities', earned: totalActivities >= 10 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">{user?.fullName}</h1>
          <p className="text-gray-400 text-sm">@{user?.username}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              user?.isVerified ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}>
              <Shield className="h-3 w-3 mr-1" />
              {user?.isVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{coins.balance}</div>
              <div className="text-xs text-gray-400">FitCoins</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{totalActivities}</div>
              <div className="text-xs text-gray-400">Activities</div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Blockchain Wallet</h3>
            <button
              onClick={() => setShowWallet(!showWallet)}
              className="text-emerald-500 text-xs hover:text-emerald-400"
            >
              {showWallet ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showWallet ? (
            <div className="space-y-2">
              <div className="bg-gray-700 p-3 rounded text-xs font-mono text-gray-300">
                {user?.walletAddress}
              </div>
              <div className="text-xs text-gray-400">
                Connected to Aptos Network
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-gray-300">Wallet Connected</span>
            </div>
          )}
        </div>

        {/* Health Stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Health Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Height</div>
              <div className="text-white font-medium">{user?.height} cm</div>
            </div>
            <div>
              <div className="text-gray-400">Weight</div>
              <div className="text-white font-medium">{user?.weight} kg</div>
            </div>
            <div>
              <div className="text-gray-400">Goal</div>
              <div className="text-white font-medium capitalize">{user?.fitnessGoal?.replace('-', ' ')}</div>
            </div>
            <div>
              <div className="text-gray-400">Avg Daily</div>
              <div className="text-white font-medium">{avgDailyCalories} cal</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  achievement.earned ? 'bg-emerald-600' : 'bg-gray-700'
                }`}>
                  <Award className={`h-4 w-4 ${
                    achievement.earned ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    achievement.earned ? 'text-white' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-500">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Activity Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Calories Burned</span>
              <span className="text-white font-medium">{Math.floor(totalCalories)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Coins Earned</span>
              <span className="text-emerald-500 font-medium">{coins.totalEarned}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Coins Spent</span>
              <span className="text-gray-300 font-medium">{coins.totalSpent}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-700">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;