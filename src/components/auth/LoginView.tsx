import React, { useState } from 'react';
import { LogIn, UserPlus, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

export function LoginView() {
  const { signIn, signUp, resetPassword, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      await resetPassword(email);
      setError('Check your email for password reset instructions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border-4 border-black">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isRegister ? 'Sign up to get started' : 'Sign in to continue'}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Testing Mode: Any email/password will work
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : isRegister ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRegister(!isRegister)}
              className="border-2 border-black"
              disabled={isLoading}
            >
              {isRegister ? 'Already have an account?' : 'Need an account?'}
            </Button>

            {!isRegister && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="border-2 border-black"
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              disabled
              className="w-full border-2 border-black opacity-50 cursor-not-allowed"
            >
              Google (Coming Soon)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}