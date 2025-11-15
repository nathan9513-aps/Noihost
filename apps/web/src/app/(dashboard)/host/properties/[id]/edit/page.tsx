'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    type: 'APARTMENT',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 500,
    description: '',
    notes: '',
    accessInstructions: '',
  });

  const propertyTypes = [
    'APARTMENT',
    'HOUSE',
    'CONDO',
    'VILLA',
    'STUDIO',
    'OTHER',
  ];

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
      setFormData({
        name: data.name || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || 'USA',
        type: data.type || 'APARTMENT',
        bedrooms: data.bedrooms || 1,
        bathrooms: data.bathrooms || 1,
        squareFeet: data.squareFeet || 500,
        description: data.description || '',
        notes: data.notes || '',
        accessInstructions: data.accessInstructions || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
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
      const response = await fetch(`${apiUrl}/properties/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          squareFeet: Number(formData.squareFeet),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update property');
      }

      router.push(`/host/properties/${params.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
            <CardTitle className="text-white text-2xl">Edit Property</CardTitle>
            <CardDescription className="text-gray-300">
              Update your property information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Basic Information</h3>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Property Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Downtown Studio Apartment"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Property Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                    required
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type} className="bg-slate-800">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Address</h3>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Street Address *</label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">City</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="San Francisco"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">State</label>
                    <Input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="CA"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">ZIP Code</label>
                    <Input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="94102"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Country</label>
                    <Input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="USA"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Property Details</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Bedrooms *</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Bathrooms *</label>
                    <Input
                      type="number"
                      min="1"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Square Feet *</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.squareFeet}
                      onChange={(e) => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Additional Information</h3>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your property..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Notes (for cleaners)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special notes for cleaners..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Access Instructions</label>
                  <textarea
                    value={formData.accessInstructions}
                    onChange={(e) => setFormData({ ...formData, accessInstructions: e.target.value })}
                    placeholder="How to access the property (lockbox code, keys, etc.)"
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-gray-500"
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
