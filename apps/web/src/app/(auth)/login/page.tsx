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

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'HOST') {
        router.push('/host');
      } else if (data.user.role === 'CLEANER') {
        router.push('/cleaner');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(0,0,0,0))]"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-float animation-delay-3000"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 shadow-2xl border border-white/20 relative z-10 animate-fade-in">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-20 blur-xl"></div>
        
        <div className="relative">
          <CardHeader className="space-y-4 pb-6">
            {/* Logo with animated glow */}
            <div className="mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <span className="text-4xl">🧹</span>
              </div>
            </div>
            
            <CardTitle className="text-3xl text-center font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NoiHost
              </span>
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-300">
              Welcome back! Sign in to your workspace
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 text-sm bg-red-500/10 border border-red-500/50 backdrop-blur-sm rounded-lg flex items-start gap-2 animate-shake">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-200">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-200">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-50 blur transition-opacity duration-300"></div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="host@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={loading}
                    className="relative bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-200">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-50 blur transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      disabled={loading}
                      className="relative bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-2xl hover:shadow-purple-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-0" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">GitHub</span>
                </button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 border-t border-white/10 pt-6">
            <p className="text-sm text-gray-300 text-center">
              Don't have an account?{' '}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign up for free
              </Link>
            </p>
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">Privacy Policy</Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
