import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Wallet, Activity, Shield, User, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AptosService } from '../services/blockchain';

const WalletConnection: React.FC = () => {
  const { connect, account, connected, disconnect, wallets } = useWallet();
  const { setUser, setIsConnected } = useApp();
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    username: '',
    fullName: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    fitnessGoal: 'weight-loss',
    email: '', // Optional - stored off-chain
    agreeTerms: false
  });

  const handleWalletConnect = async (walletName: string) => {
    try {
      setLoading(true);
      await connect(walletName);
      
      if (account?.address) {
        // Check if user exists (simulate checking on-chain)
        const existingUser = localStorage.getItem(`fitcoin_user_${account.address}`);
        
        if (existingUser) {
          // User exists, log them in
          const user = JSON.parse(existingUser);
          setUser(user);
          setIsConnected(true);
        } else {
          // New user, show registration
          setShowRegistration(true);
        }
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.address) return;

    setLoading(true);
    try {
      const aptosService = AptosService.getInstance();
      
      // In real Web3 app, this would:
      // 1. Send transaction to Aptos Move smart contract with public data
      // 2. Store private data (email) in off-chain database
      // 3. Store profile image on IPFS if provided
      
      const newUser = await aptosService.registerUser({
        email: registrationData.email,
        username: registrationData.username,
        fullName: registrationData.fullName,
        dateOfBirth: registrationData.dateOfBirth,
        height: parseInt(registrationData.height),
        weight: parseInt(registrationData.weight),
        fitnessGoal: registrationData.fitnessGoal
      });

      // Override with actual wallet address
      newUser.walletAddress = account.address;
      newUser.id = account.address;

      // Store user data (in real app, public data would be on-chain)
      localStorage.setItem(`fitcoin_user_${account.address}`, JSON.stringify(newUser));
      
      setUser(newUser);
      setIsConnected(true);
      setShowRegistration(false);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowRegistration(false);
    setIsConnected(false);
    setUser(null);
  };

  if (connected && account && !showRegistration) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <Shield className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Wallet Connected</h2>
          <p className="text-gray-400 text-sm mb-4">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </p>
          <button
            onClick={handleDisconnect}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (showRegistration && account) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-center mb-6">
            <User className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Complete Profile</h2>
            <p className="text-gray-400 text-sm">Set up your FitCoin profile</p>
            <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
              {account.address.slice(0, 8)}...{account.address.slice(-6)}
            </div>
          </div>

          <form onSubmit={handleRegistration} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Username (Public)</label>
              <input
                type="text"
                name="username"
                value={registrationData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Choose a unique username"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Stored on Aptos blockchain</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={registrationData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email (Optional - Private)</label>
              <input
                type="email"
                name="email"
                value={registrationData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Stored off-chain for privacy"
              />
              <p className="text-xs text-gray-500 mt-1">Stored privately off-chain</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={registrationData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={registrationData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={registrationData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={registrationData.fitnessGoal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="general-health">General Health</option>
              </select>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={registrationData.agreeTerms}
                  onChange={handleInputChange}
                  className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-300">
                  I agree to store my data on Aptos blockchain
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!registrationData.agreeTerms || loading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Register on Blockchain
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={handleDisconnect}
            className="w-full mt-3 text-gray-400 text-sm hover:text-gray-300"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="text-center mb-8">
          <Activity className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">FitCoin</h1>
          <p className="text-gray-400 text-sm">Move, Earn, Impact</p>
          <p className="text-gray-500 text-xs mt-2">Connect your Web3 wallet to get started</p>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletConnect(wallet.name)}
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect {wallet.name}
                </>
              )}
            </button>
          ))}
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Secured by Aptos blockchain technology
          </p>
          <p className="text-xs text-gray-600 mt-1">
            No passwords needed - your wallet is your identity
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;