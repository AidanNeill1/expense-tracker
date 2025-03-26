import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Mahi</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link to="/transactions" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Transactions
              </Link>
              <Link to="/upload" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Upload Statement
              </Link>
              <Link to="/expenses" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Expenses
              </Link>
              <Link to="/reports" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 