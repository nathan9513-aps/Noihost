'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
}

export default function NewBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    propertyId: '',
    checkIn: '',
    checkOut: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    numberOfGuests: 1,
    platform: 'AIRBNB',
    platformBookingId: '',
  });

  const platforms = ['AIRBNB', 'VRBO', 'BOOKING_COM', 'DIRECT', 'OTHER'];

  useEffect(() => {
    fetchProperties();
    // Pre-select property if coming from property detail page
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const propertyParam = params.get('property');
      if (propertyParam) {
        setFormData((prev) => ({ ...prev, propertyId: propertyParam }));
      }
    }
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          numberOfGuests: Number(formData.numberOfGuests),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create booking');
      }

      router.push('/host/bookings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperties) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => router.back()}
          className="mb-6 bg-white/10 hover:bg-white/20 border border-white/20"
        >
          ← Back
        </Button>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Add New Booking</CardTitle>
            <CardDescription className="text-gray-300">
              Create a new guest booking for your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {properties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-4">You don't have any properties yet.</p>
                <Button
                  onClick={() => router.push('/host/properties/new')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Add Your First Property
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Selection */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Property *</label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                    required
                  >
                    <option value="" className="bg-slate-800">
                      Select a property
                    </option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id} className="bg-slate-800">
                        {property.name} - {property.address}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Booking Dates</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Check-In Date *</label>
                      <Input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Check-Out Date *</label>
                      <Input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Guest Information</h3>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Guest Name *</label>
                    <Input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Guest Email</label>
                      <Input
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                        placeholder="guest@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Guest Phone</label>
                      <Input
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Number of Guests *</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.numberOfGuests}
                      onChange={(e) =>
                        setFormData({ ...formData, numberOfGuests: Number(e.target.value) })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Platform Information */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Booking Platform</h3>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Platform *</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                      required
                    >
                      {platforms.map((platform) => (
                        <option key={platform} value={platform} className="bg-slate-800">
                          {platform.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Platform Booking ID</label>
                    <Input
                      type="text"
                      value={formData.platformBookingId}
                      onChange={(e) =>
                        setFormData({ ...formData, platformBookingId: e.target.value })
                      }
                      placeholder="e.g., HMABCD123456"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Booking'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
