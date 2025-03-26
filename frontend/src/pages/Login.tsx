import { useState } from 'react';
import axios from '../services/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/mahi-logo-sm.png'; 

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState('');

  // Get the message and redirect path from location state
  const message = location.state?.message;
  const from = location.state?.from || '/home';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', form);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Navigate to the original destination or home
        navigate(from);
      } else {
        throw new Error('No token received from server');
      }
    } catch (err: any) {
      setErrors(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center mb-6">
          <img src={logo} alt="Mahi Logo" className="h-30 mb-2" />
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
              required
            />
          </div>

          {errors && (
            <p className="text-sm text-red-500 mt-2 text-center">{errors}</p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}