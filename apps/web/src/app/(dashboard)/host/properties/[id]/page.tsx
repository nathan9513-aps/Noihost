'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  notes: string;
  accessInstructions: string;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
  bookings: Array<{
    id: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: string;
    totalPrice: number;
  }>;
  cleaningJobs: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    cleaningType: string;
    price: number;
    cleaner?: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }

      const data = await response.json();
      setProperty(data);
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
      IN_PROGRESS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      COMPLETED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error || 'Property not found'}
          </div>
          <Button
            onClick={() => router.push('/host/properties')}
            className="mt-4 bg-white/10 hover:bg-white/20 border border-white/20"
          >
            ← Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Button
              onClick={() => router.push('/host/properties')}
              className="mb-4 bg-white/10 hover:bg-white/20 border border-white/20"
            >
              ← Back to Properties
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">{property.name}</h1>
            <p className="text-gray-300">
              {property.address}
              {property.city && `, ${property.city}`}
              {property.state && `, ${property.state}`}
              {property.zipCode && ` ${property.zipCode}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/host/properties/${property.id}/edit`)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Edit Property
            </Button>
            <Button
              onClick={() => router.push(`/host/bookings/new?property=${property.id}`)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              + Add Booking
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-medium">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Size</p>
                    <p className="text-white font-medium">{property.squareFeet} sq ft</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Bedrooms</p>
                    <p className="text-white font-medium">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Bathrooms</p>
                    <p className="text-white font-medium">{property.bathrooms}</p>
                  </div>
                </div>

                {property.description && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Description</p>
                    <p className="text-white">{property.description}</p>
                  </div>
                )}

                {property.notes && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Notes for Cleaners</p>
                    <p className="text-white">{property.notes}</p>
                  </div>
                )}

                {property.accessInstructions && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Access Instructions</p>
                    <p className="text-white">{property.accessInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookings */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Bookings</CardTitle>
                    <CardDescription className="text-gray-300">
                      {property.bookings.length} total bookings
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => router.push(`/host/bookings/new?property=${property.id}`)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    + Add Booking
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {property.bookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {property.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white font-medium">{booking.guestName}</p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        {booking.totalPrice && (
                          <p className="text-gray-300 text-sm">
                            Total: ${booking.totalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cleaning Jobs */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Cleaning Jobs</CardTitle>
                <CardDescription className="text-gray-300">
                  {property.cleaningJobs.length} total cleaning jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {property.cleaningJobs.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No cleaning jobs yet</p>
                ) : (
                  <div className="space-y-3">
                    {property.cleaningJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white font-medium">{job.cleaningType}</p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(job.scheduledDate)}
                            </p>
                            {job.cleaner && (
                              <p className="text-gray-300 text-sm">
                                Cleaner: {job.cleaner.firstName} {job.cleaner.lastName}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </div>
                        {job.price && (
                          <p className="text-gray-300 text-sm">Price: ${job.price.toFixed(2)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{property.bookings.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Cleaning Jobs</p>
                  <p className="text-3xl font-bold text-white">{property.cleaningJobs.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold text-white">
                    {property.bookings.filter((b) => b.status === 'CONFIRMED').length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pending Jobs</p>
                  <p className="text-3xl font-bold text-white">
                    {property.cleaningJobs.filter((j) => j.status === 'PENDING').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white font-medium">
                  {property.owner.firstName} {property.owner.lastName}
                </p>
                <p className="text-gray-400 text-sm">{property.owner.email}</p>
                <p className="text-gray-500 text-xs mt-4">
                  Added on {formatDate(property.createdAt)}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => router.push(`/host/properties/${property.id}/edit`)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Edit Property
                </Button>
                <Button
                  onClick={() => router.push(`/host/bookings/new?property=${property.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Add Booking
                </Button>
                <Button
                  onClick={() => router.push(`/host/properties/${property.id}/calendar`)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
