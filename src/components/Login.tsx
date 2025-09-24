'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore, User } from '@/stores/authStore';

interface LoginProps {
  onLogin?: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Next.js API route
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      // Handle successful login
      const { user, token, refreshToken } = response.data;
      
      // Store in Zustand store (which persists to localStorage)
      login(user, token, refreshToken);

      // Call the optional onLogin callback if provided
      if (onLogin) {
        onLogin(user);
      }

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.error || 'Login failed';
          setError(errorMessage);
        } else if (error.request) {
          // Network error
          setError('Unable to connect to server. Please check your connection.');
        } else {
          // Request setup error
          setError('An error occurred while processing your request.');
        }
      } else {
        // Generic error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Unified Lending Platform</CardTitle>
          <p className="text-muted-foreground">
            Sign in to access your lending workspace
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Use your Ahamatic credentials to sign in
          </div>
        </CardContent>
      </Card>
    </div>
  );
}