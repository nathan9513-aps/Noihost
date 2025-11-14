'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CleanerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'CLEANER') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🧹 Turno Clone</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user.firstName}! ✨
            </h2>
            <p className="text-gray-600">
              Ready to take on some cleaning jobs today?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase">This Week</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-500 mt-1">jobs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Earnings</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">$0</p>
              <p className="text-xs text-gray-500 mt-1">this month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Rating</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {user.ratingAverage || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {user.ratingCount || 0} reviews
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Completed</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-500 mt-1">total jobs</p>
            </div>
          </div>

          {/* Upcoming Jobs */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Jobs
            </h3>
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming jobs</p>
              <p className="text-sm text-gray-400 mt-2">
                Check the marketplace for new opportunities
              </p>
            </div>
          </div>

          {/* New Opportunities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              New Opportunities
            </h3>
            <div className="text-center py-12">
              <p className="text-gray-500">No new opportunities</p>
              <p className="text-sm text-gray-400 mt-2">
                Browse the marketplace to find jobs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
