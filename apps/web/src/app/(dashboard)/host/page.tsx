'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
}

interface Booking {
  id: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  property: {
    name: string;
  };
}

interface CleaningJob {
  id: string;
  scheduledDate: string;
  status: string;
  cleaningType: string;
  property: {
    name: string;
  };
  cleaner?: {
    firstName: string;
    lastName: string;
  };
}

interface Stats {
  totalProperties: number;
  activeBookings: number;
  pendingJobs: number;
  completedJobs: number;
}

export default function HostDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    activeBookings: 0,
    pendingJobs: 0,
    completedJobs: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentJobs, setRecentJobs] = useState<CleaningJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'HOST') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    loadDashboardData(token);
  }, [router]);

  const loadDashboardData = async (token: string) => {
    try {
      // Load all data in parallel
      const [bookingsRes, jobsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cleaning-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const bookings = await bookingsRes.json();
      const jobs = await jobsRes.json();

      // Calculate stats
      const uniqueProperties = new Set(bookings.map((b: Booking) => b.property));
      const activeBookings = bookings.filter((b: Booking) => b.status === 'CONFIRMED').length;
      const pendingJobs = jobs.filter((j: CleaningJob) => j.status === 'PENDING').length;
      const completedJobs = jobs.filter((j: CleaningJob) => j.status === 'COMPLETED').length;

      setStats({
        totalProperties: uniqueProperties.size,
        activeBookings,
        pendingJobs,
        completedJobs,
      });

      // Get upcoming bookings
      const upcoming = bookings
        .filter((b: Booking) => new Date(b.checkInDate) >= new Date() && b.status === 'CONFIRMED')
        .sort((a: Booking, b: Booking) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
        .slice(0, 5);

      setUpcomingBookings(upcoming);

      // Get recent jobs
      const recent = jobs
        .sort((a: CleaningJob, b: CleaningJob) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
        .slice(0, 5);

      setRecentJobs(recent);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-400',
      ASSIGNED: 'text-blue-400',
      IN_PROGRESS: 'text-purple-400',
      COMPLETED: 'text-green-400',
      CANCELLED: 'text-red-400',
      CONFIRMED: 'text-green-400',
    };
    return colors[status] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Noihost</h1>
                <p className="text-sm text-gray-300">Host Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">👋 {user?.firstName}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-300">Total Properties</CardDescription>
              <CardTitle className="text-4xl text-white">{stats.totalProperties}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Active listings
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-300">Active Bookings</CardDescription>
              <CardTitle className="text-4xl text-white">{stats.activeBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Confirmed
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-300">Pending Jobs</CardDescription>
              <CardTitle className="text-4xl text-white">{stats.pendingJobs}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Awaiting cleaners
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-300">Completed Jobs</CardDescription>
              <CardTitle className="text-4xl text-white">{stats.completedJobs}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Bookings */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Bookings</CardTitle>
              <CardDescription className="text-gray-300">Your next check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No upcoming bookings</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{booking.property.name}</h4>
                        <p className="text-sm text-gray-300">Guest: {booking.guestName}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                        </p>
                      </div>
                      <div className={`text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Cleaning Jobs */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Cleaning Jobs</CardTitle>
              <CardDescription className="text-gray-300">Latest cleaning activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentJobs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No cleaning jobs yet</p>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{job.property.name}</h4>
                        <p className="text-sm text-gray-300">
                          {job.cleaningType.replace('_', ' ')}
                          {job.cleaner && ` • ${job.cleaner.firstName} ${job.cleaner.lastName}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(job.scheduledDate)}
                        </p>
                      </div>
                      <div className={`text-sm font-semibold ${getStatusColor(job.status)}`}>
                        {job.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">Manage your properties and bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-semibold">Add Property</span>
                  </div>
                </Button>
                <Button className="h-auto py-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">New Booking</span>
                  </div>
                </Button>
                <Button className="h-auto py-6 bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 text-white">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold">Find Cleaner</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
