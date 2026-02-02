'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { isManagerialRole } from '@/lib/utils';
import type { Merchandiser } from '@/lib/types';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading: isUserLoading } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Wait until the user's authentication and profile loading is complete
      if (isUserLoading) {
        return;
      }

      // If there is a user object...
      if (user) {
        // ...and they have a profile, we can redirect them.
        if (user.profile) {
          if (isManagerialRole(user.profile.role)) {
            router.replace('/admin/dashboard');
          } else if (user.profile.role === 'supervisor') {
            router.replace('/supervisor/dashboard');
          } else {
            router.replace('/dashboard');
          }
        } else if (auth?.currentUser && firestore) {
          // If the user is authenticated but our `useUser` hook shows no profile,
          // it means the Firestore document is likely missing.
          const userDocRef = doc(firestore, 'merchandisers', auth.currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (!docSnap.exists()) {
            // The document doesn't exist, so we create a default one.
            const nameParts = auth.currentUser.displayName?.split(' ') || ['New', 'User'];
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
            
            const newUserProfile: Omit<Merchandiser, 'id'> & { id: string } = {
              id: auth.currentUser.uid,
              firstName,
              lastName,
              email: auth.currentUser.email || '',
              role: 'merchandiser', // Default role
              phoneNumber: auth.currentUser.phoneNumber || '',
              employeeNumber: '',
              idNumber: '',
            };

            // Specifically handle the admin user case.
            if (auth.currentUser.email === 'admin@merchtrack.app') {
                newUserProfile.role = 'admin';
                newUserProfile.firstName = 'Admin';
            }
            
            try {
              // Create the document and WAIT for it to complete.
              // The `useUser` hook will react to this change,
              // which will cause this `useEffect` to run again with a complete profile.
              await setDoc(userDocRef, newUserProfile, { merge: true });
            } catch (error) {
               console.error("Failed to create user profile on login:", error);
               toast({
                variant: 'destructive',
                title: 'Profile Creation Failed',
                description: 'Could not create your user profile. Please try again.',
              });
            }
          }
        }
      }
      // If there is no user and loading is complete, do nothing and show the login form.
    };
    
    checkAndRedirect();

  }, [user, isUserLoading, router, auth, firestore, toast]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      // After sign-in, the useEffect will handle profile creation and redirection.
      await signInWithPopup(auth, provider);
      toast({ title: "Logged in successfully!" });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
    } finally {
        setIsLoggingIn(false);
    }
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: 'destructive', title: 'Missing fields' });
      return;
    }
    if (!auth) return;

    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Logged in successfully!" });
      // The useEffect above will handle profile creation and redirection.
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          default:
            errorMessage = error.message;
            break;
        }
      }
      toast({ variant: 'destructive', title: 'Login Failed', description: errorMessage });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // While loading user status or if a user is authenticated and waiting for redirect, show a spinner.
  if (isUserLoading || user) {
    return (
      <div className="flex justify-center items-center min-h-dvh">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  // If no user and not loading, show the login form.
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 bg-background">
      <h1 className="text-2xl font-bold text-primary font-headline mb-4 text-center">Welcome to Brown's MerchTrack Mobile</h1>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Welcome Back</CardTitle>
          <CardDescription>Log in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" type="button" className="w-full" disabled={isLoggingIn} onClick={handleGoogleSignIn}>
                {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177 56.5L357 154.1c-34.4-32.4-78.2-52.4-126.3-52.4-98.2 0-176.6 78.4-176.6 176.6s78.4 176.6 176.6 176.6c106.1 0 162-77.7 167.3-120.3H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>}
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                {isLoggingIn ? 'Logging In...' : 'Log In'}
                </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
