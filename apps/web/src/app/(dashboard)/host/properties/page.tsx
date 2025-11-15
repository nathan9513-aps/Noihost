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

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  _count: {
    bookings: number;
    cleaningJobs: number;
  };
}

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
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
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      // Refresh the list
      fetchProperties();
    } catch (err: any) {
      alert(err.message);
    }
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
            <h1 className="text-4xl font-bold text-white mb-2">My Properties</h1>
            <p className="text-gray-300">Manage your rental properties</p>
          </div>
          <Button
            onClick={() => router.push('/host/properties/new')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            + Add Property
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No properties yet</h3>
              <p className="text-gray-300 mb-6">Get started by adding your first property</p>
              <Button
                onClick={() => router.push('/host/properties/new')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                + Add Property
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
              >
                <CardHeader>
                  <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                    {property.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {property.address}
                    {property.city && `, ${property.city}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white font-medium">{property.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bedrooms:</span>
                      <span className="text-white font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bathrooms:</span>
                      <span className="text-white font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white font-medium">{property.squareFeet} sq ft</span>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Bookings:</span>
                        <span className="text-white font-medium">{property._count.bookings}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cleaning Jobs:</span>
                        <span className="text-white font-medium">
                          {property._count.cleaningJobs}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => router.push(`/host/properties/${property.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/host/properties/${property.id}/edit`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(property.id)}
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        Delete
                      </Button>
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
