import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 animate-float">
        <div className="text-center animate-bounce-in">
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2 animate-fade-in">Sign in to continue to Planyty</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg animate-shake border border-red-200" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up delay-200">
          <div className="animate-float delay-300">
            <label className="block text-sm font-medium text-gray-700 sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-purple-500 left-3 top-1/2 transform -translate-y-1/2 animate-pulse" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 transition-all duration-300 hover:scale-105 focus:scale-105 border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="animate-float delay-400">
            <label className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-purple-500 left-3 top-1/2 transform -translate-y-1/2 animate-pulse" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 transition-all duration-300 hover:scale-105 focus:scale-105 border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg animate-pulse-slow border-2 border-transparent hover:border-white/30"
            disabled={loading}
          >
            <LogIn className="w-5 h-5 mr-2 animate-bounce" />
            {loading ? 'Logging in... ✨' : 'Sign In 🚀'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 animate-fade-in delay-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110 inline-block">
            <UserPlus className="inline w-4 h-4 mr-1 animate-bounce" />
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;