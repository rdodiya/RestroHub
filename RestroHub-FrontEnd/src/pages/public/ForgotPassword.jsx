import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Forgot Password?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The password recovery feature is currently under development. Please contact support or try again later!
        </p>
        <Link 
          to="/login" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
