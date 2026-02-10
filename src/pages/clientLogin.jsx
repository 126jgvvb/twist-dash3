import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { SERVER_IP2 } from '../serverIP';

export const ClientLogin = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_IP2}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        alert(data.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your internet connection.');
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
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
          <p className="text-white/80">Access your network management dashboard</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/client-signup')}
                className="text-white font-semibold hover:text-white/90 underline"
              >
                Sign up
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
