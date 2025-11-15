'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  platform: string;
  platformBookingId: string;
  status: string;
  property: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (filterStatus === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === filterStatus));
    }
  }, [filterStatus, bookings]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      CONFIRMED: 'bg-green-500/20 text-green-300 border-green-500/30',
      COMPLETED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${nights} night${nights > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Bookings</h1>
            <p className="text-gray-300">Manage your guest reservations</p>
          </div>
          <Button
            onClick={() => router.push('/host/bookings/new')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            + Add Booking
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="pt-6">
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setFilterStatus('ALL')}
                  className={`${
                    filterStatus === 'ALL'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  All ({bookings.length})
                </Button>
                <Button
                  onClick={() => setFilterStatus('PENDING')}
                  className={`${
                    filterStatus === 'PENDING'
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Pending ({bookings.filter((b) => b.status === 'PENDING').length})
                </Button>
                <Button
                  onClick={() => setFilterStatus('CONFIRMED')}
                  className={`${
                    filterStatus === 'CONFIRMED'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Confirmed ({bookings.filter((b) => b.status === 'CONFIRMED').length})
                </Button>
                <Button
                  onClick={() => setFilterStatus('COMPLETED')}
                  className={`${
                    filterStatus === 'COMPLETED'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Completed ({bookings.filter((b) => b.status === 'COMPLETED').length})
                </Button>
                <Button
                  onClick={() => setFilterStatus('CANCELLED')}
                  className={`${
                    filterStatus === 'CANCELLED'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Cancelled ({bookings.filter((b) => b.status === 'CANCELLED').length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                {filterStatus === 'ALL' ? 'No bookings yet' : `No ${filterStatus.toLowerCase()} bookings`}
              </h3>
              <p className="text-gray-300 mb-6">
                {filterStatus === 'ALL'
                  ? 'Create your first booking to get started'
                  : 'Try selecting a different filter'}
              </p>
              {filterStatus === 'ALL' && (
                <Button
                  onClick={() => router.push('/host/bookings/new')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  + Add Booking
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => router.push(`/host/bookings/${booking.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {booking.guestName}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {booking.property.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {booking.property.address}
                            {booking.property.city && `, ${booking.property.city}`}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Check-In</p>
                          <p className="text-white font-medium">{formatDate(booking.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Check-Out</p>
                          <p className="text-white font-medium">{formatDate(booking.checkOut)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Duration</p>
                          <p className="text-white font-medium">
                            {getDuration(booking.checkIn, booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Guests</p>
                          <p className="text-white font-medium">{booking.numberOfGuests}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Platform:</span>
                          <span className="text-white text-sm font-medium">
                            {booking.platform.replace('_', ' ')}
                          </span>
                        </div>
                        {booking.platformBookingId && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">ID:</span>
                            <span className="text-white text-sm font-mono">
                              {booking.platformBookingId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
