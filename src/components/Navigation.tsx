import React from 'react';
import { Home, ShoppingBag, User, Activity } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tracking', label: 'Activity', icon: Activity },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'text-emerald-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;