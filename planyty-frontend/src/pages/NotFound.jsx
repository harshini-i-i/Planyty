import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-center p-4">
      <h1 className="text-9xl font-extrabold text-dark">404</h1>
      <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6">Page Not Found</h2>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" className="flex items-center">
          <Home className="w-5 h-5 mr-2" />
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
