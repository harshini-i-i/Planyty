import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

const SignUp = () => {
  const [step, setStep] = useState('email'); // 'email', 'verify', 'password'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState(''); // 'google' or 'email'
  
  const { initiateSignup, verifyEmail, completeSignup } = useAuth();
  const navigate = useNavigate();

  // Step 1: Enter email and choose auth method
  const handleEmailSubmit = async (method) => {
    console.log('Button clicked for method:', method);
    console.log('Current step before:', step);
    setError('');
    
    if (!email) {
      return setError('Please enter your email address');
    }

    setLoading(true);
    setAuthMethod(method);

    try {
      const result = await initiateSignup(email, method);
      console.log('Initiate signup result:', result);
      
      // Always proceed to next step for demo
      if (method === 'google') {
        setStep('verify');
        console.log('Navigating to verify step');
      } else {
        setStep('password');
        console.log('Navigating to password step');
      }
    } catch (err) {
      console.error('Error in handleEmailSubmit:', err);
      // Even on error, proceed to next step for demo
      if (method === 'google') {
        setStep('verify');
      } else {
        setStep('password');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code (Google flow)
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      return setError('Please enter the verification code');
    }

    setLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);
      console.log('Verify result:', result);
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.log('Verify error:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password (Email flow)
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
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-dark">Create Account</h2>
          <p className="text-center text-gray-600">Get started with Planyty today</p>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-4">
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

            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => handleEmailSubmit('google')}
                className="w-full flex items-center justify-center"
                disabled={loading}
              >
                <Mail className="w-5 h-5 mr-2" />
                {loading ? 'Sending Code...' : 'Continue with Email Verification'}
              </Button>

              <Button
                type="button"
                onClick={() => handleEmailSubmit('email')}
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={loading}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Continue with Email & Password
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-dark hover:text-accent">
              <LogIn className="inline w-4 h-4 mr-1" />
              Log In
            </Link>
          </div>

          {/* Debug info - remove in production */}
          <div className="p-2 bg-yellow-100 rounded text-xs">
            <p>Debug: Email: {email}</p>
            <p>Current Step: {step}</p>
            <p>Open browser console to see logs</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Verification (Google flow)
  if (step === 'verify') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-dark mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <h2 className="text-2xl font-bold text-center text-dark">Verify Your Email</h2>
          <p className="text-center text-gray-600">
            We sent a verification code to <strong>{email}</strong>
          </p>
          <p className="text-center text-sm text-gray-500">
            Demo code: <strong>123456</strong>
          </p>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
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
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          {/* Debug info - remove in production */}
          <div className="p-2 bg-blue-100 rounded text-xs mt-4">
            <p>Debug Info:</p>
            <p>Email: {email}</p>
            <p>Code Entered: {verificationCode}</p>
            <p>Expected Code: 123456</p>
            <p>Current Step: {step}</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Password setup (Email flow)
  if (step === 'password') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-dark mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <h2 className="text-2xl font-bold text-center text-dark">Complete Your Profile</h2>
          <p className="text-center text-gray-600">
            Setting up account for <strong>{email}</strong>
          </p>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 sr-only">Full Name</label>
              <div className="relative">
                <User className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 sr-only">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <UserPlus className="w-5 h-5 mr-2" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Debug info - remove in production */}
          <div className="p-2 bg-green-100 rounded text-xs mt-4">
            <p>Debug Info:</p>
            <p>Email: {email}</p>
            <p>Name: {name}</p>
            <p>Current Step: {step}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default SignUp;