import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { SERVER_IP2 } from '../serverIP';

export const ClientSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    walletId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = formData;
      
      const response = await fetch(`${SERVER_IP2}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('wallet', JSON.stringify(data.wallet));
        
        setIsLoading(false);
        navigate('/client-dashboard');
      } else {
        alert(data.message || 'Signup failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please check your internet connection.');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">Join the TwistNet network management system</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
                placeholder="07XX XXX XXX"
                required
              />
            </div>

            <div>
              <label htmlFor="walletId" className="block text-sm font-medium text-white mb-2">
                Wallet ID
              </label>
              <input
                type="text"
                id="walletId"
                name="walletId"
                value={formData.walletId}
                readOnly
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white cursor-not-allowed"
                placeholder="Auto-generated"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/client-login')}
                className="text-white font-semibold hover:text-white/90 underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2026 TwistNet from chargedMatrix. All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};
