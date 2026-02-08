import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SignInArtisan = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password, 'artisan');
      navigate('/artisan-dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle('artisan');
      navigate('/artisan-dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('Google Sign-In is not available in this environment. Please use email/password sign-in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <img
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Artisan at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <Palette className="w-16 h-16 mb-6 text-orange-200" />
          <h1 className="text-4xl font-bold mb-4">Welcome Back, Artisan</h1>
          <p className="text-xl opacity-90 max-w-md">
            Continue sharing your beautiful crafts with the world through Zaymazone
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Palette className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Artisan Sign In</h2>
            <p className="mt-2 text-muted-foreground">
              Access your artisan dashboard
            </p>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/10"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              New artisan?{' '}
              <Link to="/sign-up-artisan" className="text-orange-600 hover:text-orange-500 font-medium">
                Join as artisan
              </Link>
            </p>
            <p className="mt-2 text-muted-foreground">
              Regular user?{' '}
              <Link to="/sign-in" className="text-primary hover:text-primary/80 font-medium">
                Sign in as customer
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              Benefits of joining as an Artisan:
            </h3>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• Showcase your handcrafted products</li>
              <li>• Reach customers across India</li>
              <li>• Manage orders and inventory</li>
              <li>• Connect with fellow artisans</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInArtisan;