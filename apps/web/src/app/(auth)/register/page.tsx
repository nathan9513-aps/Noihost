'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'HOST',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'HOST') {
        router.push('/host');
      } else {
        router.push('/cleaner');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">🧹 Turno Clone</CardTitle>
          <CardDescription className="text-center">Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{error}</div>}
            <div>
              <label className="text-sm font-medium">I am a</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center"><input type="radio" name="role" value="HOST" checked={formData.role === 'HOST'} onChange={() => setFormData({ ...formData, role: 'HOST' })} className="mr-2" /><span>Host</span></label>
                <label className="flex items-center"><input type="radio" name="role" value="CLEANER" checked={formData.role === 'CLEANER'} onChange={() => setFormData({ ...formData, role: 'CLEANER' })} className="mr-2" /><span>Cleaner</span></label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label htmlFor="firstName" className="text-sm font-medium">First Name</label><Input id="firstName" type="text" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required disabled={loading} /></div>
              <div><label htmlFor="lastName" className="text-sm font-medium">Last Name</label><Input id="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required disabled={loading} /></div>
            </div>
            <div><label htmlFor="email" className="text-sm font-medium">Email</label><Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading} /></div>
            <div><label htmlFor="phone" className="text-sm font-medium">Phone (optional)</label><Input id="phone" type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={loading} /></div>
            <div><label htmlFor="password" className="text-sm font-medium">Password</label><Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} disabled={loading} /><p className="text-xs text-muted-foreground mt-1">At least 6 characters</p></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
