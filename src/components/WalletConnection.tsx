import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Wallet, Activity, Shield, User, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AptosService } from '../services/blockchain';

const WalletConnection: React.FC = () => {
  const { connect, account, connected, disconnect, wallets, signAndSubmitTransaction } = useWallet();
  const { setUser, setIsConnected } = useApp();
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    username: '',
    fullName: '',
    height: '',
    weight: '',
    fitnessGoal: 'weight-loss',
  });

  const handleWalletConnect = async (walletName: string) => {
    try {
      setLoading(true);
      await connect(walletName);
      
      if (account?.address) {
        const aptosService = AptosService.getInstance();
        
        // Check if user is registered on blockchain
        const isRegistered = await aptosService.isUserRegistered(account.address);
        
        if (isRegistered) {
          // User exists on blockchain, load their profile
          const user = await aptosService.getUserProfile(account.address);
          if (user) {
            setUser(user);
            setIsConnected(true);
          }
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
      
      // Create registration transaction
      const transactionPayload = await aptosService.registerUser(account.address, {
        username: registrationData.username,
        fullName: registrationData.fullName,
        height: parseInt(registrationData.height),
        weight: parseInt(registrationData.weight),
        fitnessGoal: registrationData.fitnessGoal
      });

      // Submit transaction through wallet
      const transaction = JSON.parse(transactionPayload);
      const response = await signAndSubmitTransaction({
        data: {
          function: transaction.function,
          functionArguments: transaction.arguments,
        }
      });

      console.log('Registration transaction:', response);

      // Wait for transaction to be processed
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Load user profile from blockchain
      const user = await aptosService.getUserProfile(account.address);
      if (user) {
        setUser(user);
        setIsConnected(true);
        setShowRegistration(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
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
            <h2 className="text-xl font-bold text-white">Register on Blockchain</h2>
            <p className="text-gray-400 text-sm">Create your FitCoin profile</p>
            <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
              {account.address.slice(0, 8)}...{account.address.slice(-6)}
            </div>
          </div>

          <form onSubmit={handleRegistration} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Username (On-Chain)</label>
              <input
                type="text"
                name="username"
                value={registrationData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Choose a unique username"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Stored permanently on Aptos blockchain</p>
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
              <div className="text-xs text-gray-300 space-y-1">
                <p>✓ Data stored on Aptos blockchain</p>
                <p>✓ Decentralized and secure</p>
                <p>✓ You own your data</p>
                <p>✓ 50 FitCoins welcome bonus</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
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
          <p className="text-gray-500 text-xs mt-2">Pure Web3 - No passwords needed</p>
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
          <div className="space-y-2 text-xs text-gray-500">
            <p>🔐 Your wallet = Your identity</p>
            <p>⛓️ All data stored on Aptos blockchain</p>
            <p>🪙 Earn FitCoins for every activity</p>
            <p>🌱 Use coins for real-world impact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;