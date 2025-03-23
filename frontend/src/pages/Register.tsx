import { useState } from 'react';
import axios from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/mahi-logo-sm.png'; 

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/register', form);
      navigate('/login');
    } catch (err: any) {
      setErrors(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Mahi Logo" className="h-30 mb-2" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
              required
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
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
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}