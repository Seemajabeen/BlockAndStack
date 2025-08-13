import React, { useState } from 'react';
import { ShoppingBag, Shield, TreePine, TrendingUp, Coins } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MarketplaceItem } from '../types';

const Marketplace: React.FC = () => {
  const { coins, setCoins } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const marketplaceItems: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Insurance Discount 10%',
      description: 'Get 10% discount on your health insurance premium',
      coinCost: 500,
      category: 'insurance',
      available: true
    },
    {
      id: '2',
      title: 'Insurance Discount 25%',
      description: 'Get 25% discount on your health insurance premium',
      coinCost: 1200,
      category: 'insurance',
      available: true
    },
    {
      id: '3',
      title: 'Partner Ad Revenue',
      description: 'Earn from viewing partner advertisements',
      coinCost: 200,
      category: 'advertising',
      available: true
    },
    {
      id: '4',
      title: 'Premium Ad Slots',
      description: 'Access to premium advertising opportunities',
      coinCost: 800,
      category: 'advertising',
      available: true
    },
    {
      id: '5',
      title: 'Plant 1 Tree',
      description: 'Fund planting of 1 tree for environmental impact',
      coinCost: 100,
      category: 'eco',
      available: true
    },
    {
      id: '6',
      title: 'Plant 10 Trees',
      description: 'Fund planting of 10 trees for greater environmental impact',
      coinCost: 900,
      category: 'eco',
      available: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: ShoppingBag, color: 'text-gray-400' },
    { id: 'insurance', name: 'Insurance', icon: Shield, color: 'text-blue-400' },
    { id: 'advertising', name: 'Advertising', icon: TrendingUp, color: 'text-purple-400' },
    { id: 'eco', name: 'Eco-Tree', icon: TreePine, color: 'text-green-400' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? marketplaceItems 
    : marketplaceItems.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'insurance': return Shield;
      case 'advertising': return TrendingUp;
      case 'eco': return TreePine;
      default: return ShoppingBag;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'insurance': return 'text-blue-400';
      case 'advertising': return 'text-purple-400';
      case 'eco': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const handlePurchase = async (item: MarketplaceItem) => {
    if (coins.balance < item.coinCost) {
      alert('Insufficient FitCoins!');
      return;
    }

    setLoading(item.id);
    
    try {
      // Simulate purchase process
      setTimeout(() => {
        const updatedCoins = {
          balance: coins.balance - item.coinCost,
          totalEarned: coins.totalEarned,
          totalSpent: coins.totalSpent + item.coinCost
        };
        
        setCoins(updatedCoins);
        localStorage.setItem('fitcoin_coins', JSON.stringify(updatedCoins));
        alert(`Successfully purchased: ${item.title}!`);
        setLoading(null);
      }, 1500);
    } catch (error) {
      console.error('Purchase failed:', error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-xl font-bold text-white mb-1">Marketplace</h1>
          <p className="text-gray-400 text-sm">Use your FitCoins wisely</p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-emerald-100 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-white">{coins.balance} FC</div>
            </div>
            <Coins className="h-8 w-8 text-emerald-200" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Icon className={`h-4 w-4 ${selectedCategory === category.id ? 'text-white' : category.color}`} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Marketplace Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const colorClass = getCategoryColor(item.category);
            const canAfford = coins.balance >= item.coinCost;
            
            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-700`}>
                      <Icon className={`h-5 w-5 ${colorClass}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold text-white">{item.coinCost} FC</span>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford || loading === item.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      canAfford
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === item.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : canAfford ? (
                      'Purchase'
                    ) : (
                      'Insufficient FC'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No items available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;