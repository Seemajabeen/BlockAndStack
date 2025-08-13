import React, { useState } from 'react';
import { User, ChevronRight, Activity, Shield, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AptosService } from '../services/blockchain';

interface RegistrationProps {
  onComplete: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const { setUser, setIsConnected } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    fitnessGoal: 'weight-loss',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeHealth: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const aptosService = AptosService.getInstance();
      const newUser = await aptosService.registerUser({
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        fitnessGoal: formData.fitnessGoal
      });

      localStorage.setItem('fitcoin_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsConnected(true);
      onComplete();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Activity className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">Account Details</h2>
        <p className="text-gray-400 text-sm">Create your FitCoin account</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Heart className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">Health Profile</h2>
        <p className="text-gray-400 text-sm">Help us personalize your experience</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
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
            value={formData.height}
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
            value={formData.weight}
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
          value={formData.fitnessGoal}
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">Terms & Blockchain</h2>
        <p className="text-gray-400 text-sm">Final step to activate your account</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-white mb-2">Blockchain Integration</h3>
        <p className="text-xs text-gray-300 mb-3">
          Your fitness data and earnings will be stored on Aptos blockchain for transparency and security.
        </p>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="agreeTerms" className="text-xs text-gray-300">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-white mb-2">Health Data Consent</h3>
        <p className="text-xs text-gray-300 mb-3">
          FitCoin will track your physical activities to calculate coin rewards.
        </p>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agreeHealth"
            name="agreeHealth"
            checked={formData.agreeHealth}
            onChange={handleInputChange}
            className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="agreeHealth" className="text-xs text-gray-300">
            I consent to health data collection for fitness tracking
          </label>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        By registering, your account will be created on the Aptos blockchain
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.email && formData.username && formData.fullName && 
               formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword;
      case 2:
        return formData.dateOfBirth && formData.height && formData.weight;
      case 3:
        return formData.agreeTerms && formData.agreeHealth;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/* Progress indicators */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-12 mx-1 rounded-full ${
                i <= step ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <button
            type="submit"
            disabled={!isStepValid() || loading}
            className="w-full mt-6 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                {step === 3 ? 'Create Account' : 'Continue'}
                {step < 3 && <ChevronRight className="ml-1 h-4 w-4" />}
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-xs text-gray-400">Step {step} of 3</span>
        </div>
      </div>
    </div>
  );
};

export default Registration;