import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, UserPlus, LogIn, ArrowLeft, Sparkles, Key, Shield } from 'lucide-react';

const SignUp = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('');
  
  const { initiateSignup, verifyEmail, completeSignup } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (method) => {
    setError('');
    
    if (!email) {
      return setError('Please enter your email address');
    }

    setLoading(true);
    setAuthMethod(method);

    try {
      const result = await initiateSignup(email, method);
      
      if (method === 'google') {
        setStep('verify');
      } else {
        setStep('password');
      }
    } catch (err) {
      if (method === 'google') {
        setStep('verify');
      } else {
        setStep('password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      return setError('Please enter the verification code');
    }

    setLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const result = await completeSignup(name, password);
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'verify' || step === 'password') {
      setStep('email');
      setError('');
    }
  };

  // Step 1: Email entry
  if (step === 'email') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] p-6">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 animate-float">
          <div className="text-center animate-bounce-in">
            <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2 animate-fade-in">Get started with Planyty today</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg animate-shake border border-red-200" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-4 animate-slide-up delay-200">
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

            <div className="space-y-3 animate-stagger">
              <Button
                type="button"
                onClick={() => handleEmailSubmit('google')}
                className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg animate-pulse-slow border-2 border-transparent hover:border-white/30"
                disabled={loading}
              >
                <Mail className="w-5 h-5 mr-2 animate-bounce" />
                {loading ? 'Sending Magic Code... ✨' : 'Continue with Email Verification'}
              </Button>

              <Button
                type="button"
                onClick={() => handleEmailSubmit('email')}
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg border-2 border-transparent hover:border-white/30 animate-float delay-100"
                disabled={loading}
              >
                <Key className="w-5 h-5 mr-2 animate-bounce" />
                {loading ? 'Setting Up... 🔐' : 'Continue with Email & Password'}
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 animate-fade-in delay-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110 inline-block">
              <LogIn className="inline w-4 h-4 mr-1 animate-bounce" />
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Verification (Google flow)
  if (step === 'verify') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] p-6">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 animate-slide-in-right">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-105 mb-4 animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="text-center animate-bounce-in">
            <Key className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mt-2">
              We sent a verification code to <strong className="text-purple-600 animate-pulse">{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-1 animate-fade-in">
              Demo code: <strong className="text-purple-600">123456</strong>
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg animate-shake border border-red-200" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifySubmit} className="space-y-4 animate-slide-up delay-300">
            <div className="animate-float">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength={6}
                className="transition-all duration-300 hover:scale-105 focus:scale-105 text-center text-lg font-bold tracking-widest border-purple-200 focus:border-purple-500 animate-pulse-slow"
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg animate-pulse-slow border-2 border-transparent hover:border-white/30"
              disabled={loading}
            >
              <Shield className="w-5 h-5 mr-2 animate-bounce" />
              {loading ? 'Verifying... 🔒' : 'Verify & Continue 🚀'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Password setup (Email flow)
  if (step === 'password') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] p-6">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 animate-slide-in-left">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-105 mb-4 animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="text-center animate-bounce-in">
            <User className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 mt-2">
              Setting up account for <strong className="text-purple-600 animate-pulse">{email}</strong>
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg animate-shake border border-red-200" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-stagger">
            <div className="animate-slide-up delay-100">
              <label className="block text-sm font-medium text-gray-700 sr-only">Full Name</label>
              <div className="relative">
                <User className="absolute w-5 h-5 text-purple-500 left-3 top-1/2 transform -translate-y-1/2 animate-pulse" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 transition-all duration-300 hover:scale-105 focus:scale-105 border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="animate-slide-up delay-200">
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
            <div className="animate-slide-up delay-300">
              <label className="block text-sm font-medium text-gray-700 sr-only">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-purple-500 left-3 top-1/2 transform -translate-y-1/2 animate-pulse" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 transition-all duration-300 hover:scale-105 focus:scale-105 border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg animate-pulse-slow border-2 border-transparent hover:border-white/30 mt-4"
              disabled={loading}
            >
              <UserPlus className="w-5 h-5 mr-2 animate-bounce" />
              {loading ? 'Creating Account... ✨' : 'Create Account 🎉'}
            </Button>
          </form>
        </div>
      </div>
    );
  }
};

export default SignUp;