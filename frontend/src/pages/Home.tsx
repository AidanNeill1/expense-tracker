// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your Finances with Mahi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Smart expense tracking that helps you understand and manage your spending habits with ease.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-800 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Mahi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-blue-100 dark:bg-gray-700 dark:border-gray-600">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Statement Upload
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily upload your bank statements and let Mahi automatically categorize your transactions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-blue-100 dark:bg-gray-700 dark:border-gray-600">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get detailed insights into your spending patterns with interactive charts and reports.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-blue-100 dark:bg-gray-700 dark:border-gray-600">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your financial data is encrypted and protected with industry-standard security measures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Managing Your Expenses?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who are already saving money with Mahi.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}