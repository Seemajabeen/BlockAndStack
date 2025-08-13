import React, { useState, useEffect } from 'react';
import { Activity, Coins, TrendingUp, Target, Play, Pause, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AptosService } from '../services/blockchain';

const Dashboard: React.FC = () => {
  const { user, coins, setCoins, activities, setActivities, isTracking, setIsTracking } = useApp();
  const [currentActivity, setCurrentActivity] = useState({
    duration: 0,
    caloriesBurned: 0,
    coinsEarning: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentActivity(prev => {
          const newCalories = prev.caloriesBurned + Math.random() * 2;
          const newCoins = Math.floor(newCalories * 0.1);
          return {
            duration: prev.duration + 1,
            caloriesBurned: newCalories,
            coinsEarning: newCoins
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const handleStartStop = async () => {
    if (!isTracking) {
      // Start tracking
      setIsTracking(true);
      setCurrentActivity({ duration: 0, caloriesBurned: 0, coinsEarning: 0 });
    } else {
      // Stop tracking and save activity
      setIsTracking(false);
      
      if (currentActivity.caloriesBurned > 0) {
        const aptosService = AptosService.getInstance();
        const coinsEarned = await aptosService.earnCoins(user!.id, currentActivity.caloriesBurned);
        
        const newActivity = {
          id: `activity_${Date.now()}`,
          userId: user!.id,
          activityType: 'workout' as const,
          duration: Math.floor(currentActivity.duration / 60),
          caloriesBurned: Math.floor(currentActivity.caloriesBurned),
          coinsEarned,
          timestamp: new Date().toISOString()
        };

        const updatedActivities = [...activities, newActivity];
        const updatedCoins = {
          balance: coins.balance + coinsEarned,
          totalEarned: coins.totalEarned + coinsEarned,
          totalSpent: coins.totalSpent
        };

        setActivities(updatedActivities);
        setCoins(updatedCoins);
        localStorage.setItem('fitcoin_activities', JSON.stringify(updatedActivities));
        localStorage.setItem('fitcoin_coins', JSON.stringify(updatedCoins));
        
        setCurrentActivity({ duration: 0, caloriesBurned: 0, coinsEarning: 0 });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todaysActivities = activities.filter(activity => {
    const today = new Date().toDateString();
    const activityDate = new Date(activity.timestamp).toDateString();
    return today === activityDate;
  });

  const todaysCalories = todaysActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
  const todaysCoins = todaysActivities.reduce((sum, activity) => sum + activity.coinsEarned, 0);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-sm mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-xl font-bold text-white mb-1">Welcome back!</h1>
          <p className="text-gray-400 text-sm">{user?.fullName}</p>
        </div>

        {/* Current Activity Tracker */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="h-24 w-24 rounded-full border-4 border-white/30 flex items-center justify-center mx-auto mb-3">
                <div className="text-2xl font-bold text-white">
                  {formatTime(currentActivity.duration)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {Math.floor(currentActivity.caloriesBurned)}
                </div>
                <div className="text-xs text-emerald-100">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {Math.floor(currentActivity.coinsEarning)}
                </div>
                <div className="text-xs text-emerald-100">Earning</div>
              </div>
            </div>

            <button
              onClick={handleStartStop}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                isTracking 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white text-emerald-600 hover:bg-gray-100'
              }`}
            >
              {isTracking ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Activity
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Activity
                </>
              )}
            </button>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              <span className="text-xs text-gray-400">Today</span>
            </div>
            <div className="text-xl font-bold text-white">{Math.floor(todaysCalories)}</div>
            <div className="text-xs text-gray-400">Calories burned</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="text-xs text-gray-400">Earned</span>
            </div>
            <div className="text-xl font-bold text-white">{todaysCoins}</div>
            <div className="text-xs text-gray-400">FitCoins</div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Wallet Balance</h3>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{coins.balance}</div>
          <div className="text-xs text-gray-400">FitCoins available</div>
          <div className="text-xs text-gray-500 mt-2">
            Total earned: {coins.totalEarned} | Spent: {coins.totalSpent}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Use Your Coins</h3>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center p-3 bg-blue-600/20 rounded-lg border border-blue-600/30">
              <Target className="h-5 w-5 text-blue-400 mb-1" />
              <span className="text-xs text-blue-400">Insurance</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-purple-600/20 rounded-lg border border-purple-600/30">
              <Award className="h-5 w-5 text-purple-400 mb-1" />
              <span className="text-xs text-purple-400">Ads</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-green-600/20 rounded-lg border border-green-600/30">
              <Activity className="h-5 w-5 text-green-400 mb-1" />
              <span className="text-xs text-green-400">Trees</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        {activities.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">Recent Activities</h3>
            <div className="space-y-2">
              {activities.slice(-3).reverse().map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-emerald-500 mr-2" />
                    <div>
                      <div className="text-xs text-white font-medium">
                        {activity.duration}min workout
                      </div>
                      <div className="text-xs text-gray-400">
                        {Math.floor(activity.caloriesBurned)} cal
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-500 font-medium">
                      +{activity.coinsEarned} FC
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;