import React, { useState } from 'react';
import { LogIn, Activity } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LoginProps {
  onLogin: () => void;
  onSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const { setUser, setIsConnected } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate login process
      setTimeout(() => {
        // Check if user exists in localStorage
        const savedUser = localStorage.getItem('fitcoin_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUser(user);
          setIsConnected(true);
          onLogin();
        } else {
          alert('User not found. Please register first.');
        }
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="text-center mb-8">
          <Activity className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">FitCoin</h1>
          <p className="text-gray-400 text-sm">Move, Earn, Impact</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSignup}
              className="text-emerald-500 hover:text-emerald-400 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Secured by Aptos blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;