// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Create a wrapper component that uses the hook
export const AuthProvider = ({ children }) => {
  return <AuthProviderContent>{children}</AuthProviderContent>;
};

// Separate component that uses hooks
const AuthProviderContent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signupData, setSignupData] = useState(null);
  const navigate = useNavigate();

  // Check if user exists in localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('planyty_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Step 1: Initiate signup with email
  const initiateSignup = async (email, authMethod) => {
    try {
      console.log('Initiate signup:', email, authMethod);
      
      // Store temporary signup data
      const tempData = {
        email,
        authMethod,
        verificationCode: '123456',
        step: authMethod === 'google' ? 'verify' : 'password'
      };
      
      setSignupData(tempData);
      localStorage.setItem('planyty_signup_temp', JSON.stringify(tempData));
      
      if (authMethod === 'google') {
        console.log(`Verification code sent to ${email}: 123456`);
      } else {
        console.log(`Proceeding to password setup for ${email}`);
      }
      
      return { success: true, tempData };
    } catch (error) {
      console.error('Signup initiation error:', error);
      // Even on error, return success for demo
      return { success: true };
    }
  };

  // Step 2: Verify email with code (for Google flow)
  const verifyEmail = async (email, code) => {
    try {
      console.log('Verifying email:', email, 'with code:', code);
      
      const storedData = JSON.parse(localStorage.getItem('planyty_signup_temp') || '{}');
      console.log('Stored data:', storedData);
      
      if (storedData.email === email && storedData.verificationCode === code) {
        console.log('Verification successful!');
        
        const userData = {
          id: Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'member',
          authMethod: 'google'
        };
        
        setUser(userData);
        localStorage.setItem('planyty_user', JSON.stringify(userData));
        localStorage.removeItem('planyty_signup_temp');
        setSignupData(null);
        
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  };

  // Step 3: Complete signup with password (for email flow)
  const completeSignup = async (name, password) => {
    try {
      const storedData = JSON.parse(localStorage.getItem('planyty_signup_temp') || '{}');
      console.log('Completing signup for:', storedData.email);
      
      if (!storedData.email) {
        throw new Error('No signup data found. Please start over.');
      }
      
      const userData = {
        id: Date.now(),
        name: name,
        email: storedData.email,
        role: 'member',
        authMethod: 'email'
      };
      
      setUser(userData);
      localStorage.setItem('planyty_user', JSON.stringify(userData));
      localStorage.removeItem('planyty_signup_temp');
      setSignupData(null);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Complete signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', email);
      
      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        role: 'member'
      };
      
      setUser(userData);
      localStorage.setItem('planyty_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('planyty_user');
    localStorage.removeItem('planyty_signup_temp');
    console.log('User logged out');
    navigate('/signup');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    initiateSignup,
    verifyEmail,
    completeSignup,
    signupData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};