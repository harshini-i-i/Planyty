import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

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
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-dark">Welcome Back</h2>
        <p className="text-center text-gray-600">Sign in to continue to Planyty</p>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={loading}
          >
            <LogIn className="w-5 h-5 mr-2" />
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-dark hover:text-accent">
            <UserPlus className="inline w-4 h-4 mr-1" />
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;